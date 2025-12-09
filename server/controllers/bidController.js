import * as BidServices from "../services/bid.service.js";

export const placeBid = async (req, res) => {
  try {
    const { productId, maxPrice } = req.body;
    const userId = req.user.id;
    const order = { maxPrice: "desc", createdAt: "asc" };

    const bid = await BidServices.create(userId, productId, maxPrice);

    const allBids = await BidServices.getByProduct(productId, order);

    
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Server error" });
  }
};
