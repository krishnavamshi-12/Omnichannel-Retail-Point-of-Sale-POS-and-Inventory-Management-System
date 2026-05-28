import express from "express";

const router = express.Router();

// Test Route
router.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Product Routes Working",
  });
});

export default router;