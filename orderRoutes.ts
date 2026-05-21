import { Router } from "express";

import { createOrder }
from "../controllers/orderController.js";

import authMiddleware
from "../middleware/authMiddleware.js";

const router = Router();

router.post(
  "/",
  authMiddleware,
  createOrder
);

export default router;