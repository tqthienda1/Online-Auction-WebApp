import prisma from "../prismaClient.js";
import { submitRating } from "../services/rating.service.js";

export const createOrToggleRating = async (req, res) => {
  try {
    const { productID } = req.params;
    const { score, descriptionRating } = req.body;
    const raterID = req.user.id; // từ authMiddleware

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

    return res.json(result);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};
