import express from "express";

const router = express.Router();

// Test Route
router.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Order Routes Working",
  });
});

export default router;