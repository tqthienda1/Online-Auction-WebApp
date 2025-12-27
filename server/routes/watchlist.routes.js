import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { requireRole } from "../middlewares/requireRole.js";
import * as watchlistController from "../controllers/watchlistController.js";

const router = express.Router();

// Get user's watchlist
router.get(
  "/",
  authMiddleware,
  requireRole(["BIDDER", "SELLER"]),
  watchlistController.getWatchlist
);

// Add product to watchlist
router.post(
  "/",
  authMiddleware,
  requireRole(["BIDDER", "SELLER"]),
  watchlistController.addToWatchlist
);

// Remove product from watchlist
router.delete(
  "/:productId",
  authMiddleware,
  requireRole(["BIDDER", "SELLER"]),
  watchlistController.removeFromWatchlist
);

// Check if product is in user's watchlist
router.get(
  "/check/:productId",
  authMiddleware,
  requireRole(["BIDDER", "SELLER"]),
  watchlistController.checkWatchlist
);

export default router;
