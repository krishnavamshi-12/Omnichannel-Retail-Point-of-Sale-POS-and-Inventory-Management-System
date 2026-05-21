import mongoose from "mongoose";
import { Response } from "express";

import Product from "../models/Product.js";
import Order from "../models/Order.js";
import InventoryLedger from "../models/InventoryLedger.js";

import { AuthRequest } from "../middleware/authMiddleware.js";

// CREATE ORDER
export const createOrder = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  const session =
    await mongoose.startSession();

  session.startTransaction();

  try {
    const {
      items,
      paymentMethod,
      tax,
      discount
    } = req.body;

    let subtotal = 0;

    // Validate Products
    for (const item of items) {
      const product =
        await Product.findById(
          item.product
        ).session(session);

      if (!product) {
        throw new Error(
          `Product not found`
        );
      }

      if (product.stock < item.quantity) {
        throw new Error(
          `Insufficient stock for ${product.name}`
        );
      }

      // Reduce Stock
      const previousStock =
        product.stock;

      product.stock -= item.quantity;

      await product.save({ session });

      // Inventory Ledger Entry
      await InventoryLedger.create(
        [
          {
            product: product._id,
            changeType: "sale",
            quantityChange:
              -item.quantity,
            previousStock,
            newStock: product.stock
          }
        ],
        { session }
      );

      item.productName = product.name;
      item.sku = product.sku;
      item.unitPrice = product.price;
      item.totalPrice =
        product.price * item.quantity;

      subtotal += item.totalPrice;
    }

    const totalAmount =
      subtotal + tax - discount;

    // Create Order
    const order = await Order.create(
      [
        {
          orderNumber:
            "ORD-" + Date.now(),
          items,
          subtotal,
          tax,
          discount,
          totalAmount,
          paymentMethod,
          cashier:
            req.user?.userId
        }
      ],
      { session }
    );

    await session.commitTransaction();

    res.status(201).json({
      message:
        "Order placed successfully",
      order
    });
  } catch (error: any) {
    await session.abortTransaction();

    res.status(500).json({
      message: error.message
    });
  } finally {
    session.endSession();
  }
};