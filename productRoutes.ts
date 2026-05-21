import { Router } from "express";

import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct
} from "../controllers/productController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

const router = Router();

// CREATE PRODUCT
router.post(
  "/",
  authMiddleware,
  roleMiddleware("admin", "manager"),
  createProduct
);

// GET PRODUCTS
router.get(
  "/",
  authMiddleware,
  getProducts
);

// GET SINGLE PRODUCT
router.get(
  "/:id",
  authMiddleware,
  getProductById
);

// UPDATE PRODUCT
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("admin", "manager"),
  updateProduct
);

// DELETE PRODUCT
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  deleteProduct
);

export default router;