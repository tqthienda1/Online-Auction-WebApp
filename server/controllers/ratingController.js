import prisma from "../prismaClient.js";
import { submitRating } from "../services/rating.service.js";
import { getRatingForProduct } from "../services/rating.service.js";

export const createOrToggleRating = async (req, res) => {
  try {
    const { productID } = req.params;
    const { score, descriptionRating } = req.body;
    const raterID = req.user.id;

    if (![1, -1].includes(score)) {
      return res.status(400).json({ message: "score must be 1 or -1" });
    }

    const order = await prisma.order.findUnique({
      where: { productID },
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    let rateeID;

    if (raterID === order.buyerID) {
      rateeID = order.sellerID; // buyer → rate seller
    } else if (raterID === order.sellerID) {
      rateeID = order.buyerID; // seller → rate buyer
    } else {
      return res.status(403).json({ message: "Not allowed to rate this order" });
    }

    const result = await submitRating({
      raterID,
      rateeID,
      productID,
      value: score,
      comment: descriptionRating,
    });

    // If a rating was created or updated (not removed), mark order as in RATING state
    if (!result.removed) {
      try {
        await prisma.order.update({
          where: { productID },
          data: { status: 'RATING' },
        });
      } catch (updateErr) {
        console.error('Failed to update order status to RATING:', updateErr);
        // continue — rating succeeded but status update failed
      }
    }

    return res.json(result);
  } catch (err) {
    console.error("Submit rating failed:", err);
    if (err && err.status && err.message) {
      return res.status(err.status).json({ message: err.message });
    }
    console.error(err.stack || err);
    return res.status(500).json({ message: err.message || "Server error" });
  }
};

export const getRatingForCurrentUser = async (req, res) => {
  try {
    const { productID } = req.params;
    const raterID = req.user.id;

    const rating = await getRatingForProduct({ productID, raterID });
    if (!rating) return res.status(200).json({ found: false });
    return res.json({ found: true, rating });
  } catch (err) {
    console.error('Get rating failed:', err);
    return res.status(500).json({ message: err.message || 'Server error' });
  }
};

