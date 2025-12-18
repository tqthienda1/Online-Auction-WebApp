import express from "express";
import { createOrToggleRating } from "../controllers/ratingController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

// POST /rating/products/:productID/rate
router.post("/products/:productID/rate", authMiddleware, createOrToggleRating);

export default router;
