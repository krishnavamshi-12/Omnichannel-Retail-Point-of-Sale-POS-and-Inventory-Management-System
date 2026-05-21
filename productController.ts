import { Request, Response } from "express";
import Product from "../models/Product.js";
import redisClient from "../config/redis.js";

// CREATE PRODUCT
export const createProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const product = await Product.create(req.body);

    // Clear cache
    await redisClient.del("products");

    res.status(201).json({
      message: "Product created successfully",
      product
    });
  } catch (error: any) {
    res.status(500).json({
      message: error.message
    });
  }
};

// GET ALL PRODUCTS
export const getProducts = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Check Redis Cache
    const cachedProducts = await redisClient.get("products");

    if (cachedProducts) {
      res.status(200).json({
        source: "redis-cache",
        products: JSON.parse(cachedProducts)
      });
      return;
    }

    // Pagination
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;

    const skip = (page - 1) * limit;

    // Search
    const rawSearch = req.query.search;
    const search = typeof rawSearch === "string"
      ? rawSearch
      : Array.isArray(rawSearch)
      ? rawSearch.find((item): item is string => typeof item === "string") ?? ""
      : "";

    const query = {
      $or: [
        {
          name: {
            $regex: search,
            $options: "i"
          }
        },
        {
          category: {
            $regex: search,
            $options: "i"
          }
        },
        {
          sku: {
            $regex: search,
            $options: "i"
          }
        }
      ]
    };

    const products = await Product.find(query)
      .skip(skip)
      .limit(limit);

    // Save to Redis
    await redisClient.set(
      "products",
      JSON.stringify(products),
      {
        EX: 60
      }
    );

    res.status(200).json({
      source: "mongodb",
      products
    });
  } catch (error: any) {
    res.status(500).json({
      message: error.message
    });
  }
};

// GET SINGLE PRODUCT
export const getProductById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const product = await Product.findById(
      req.params.id
    );

    if (!product) {
      res.status(404).json({
        message: "Product not found"
      });
      return;
    }

    res.status(200).json(product);
  } catch (error: any) {
    res.status(500).json({
      message: error.message
    });
  }
};

// UPDATE PRODUCT
export const updateProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const updatedProduct =
      await Product.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true
        }
      );

    // Clear Redis cache
    await redisClient.del("products");

    res.status(200).json({
      message: "Product updated successfully",
      updatedProduct
    });
  } catch (error: any) {
    res.status(500).json({
      message: error.message
    });
  }
};

// DELETE PRODUCT
export const deleteProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    await Product.findByIdAndDelete(
      req.params.id
    );

    // Clear cache
    await redisClient.del("products");

    res.status(200).json({
      message: "Product deleted successfully"
    });
  } catch (error: any) {
    res.status(500).json({
      message: error.message
    });
  }
};