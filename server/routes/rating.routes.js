import express from "express";
import { createOrToggleRating, getRatingForCurrentUser } from "../controllers/ratingController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

// POST /rating/:productID/rate
router.post("/:productID/rate", authMiddleware, createOrToggleRating);

// GET /rating/:productID  -> get current user's rating for that product
router.get("/:productID", authMiddleware, getRatingForCurrentUser);

export default router;
