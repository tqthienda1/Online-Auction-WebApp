import prisma from "../prismaClient";

export const addProduct = async (req, res) => {
  try {
    const {
      productName,
      category,
      subCategory,
      startingPrice,
      bidStep,
      buyNow,
      imgs,
      desc,
      sellerID
    } = req.body;

    
  } catch (error) {
    console.error("Add product fail", error);
    return res.status(500).json({ message: "Server error." });
  }
};
