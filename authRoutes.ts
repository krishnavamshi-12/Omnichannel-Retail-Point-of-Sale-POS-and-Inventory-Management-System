import express from "express";

const router = express.Router();

// Test Register Route
router.post("/register", (req, res) => {
  res.json({
    message: "Register API Working",
    body: req.body
  });
});

// Test Login Route
router.post("/login", (req, res) => {
  res.json({
    message: "Login API Working"
  });
});

export default router;