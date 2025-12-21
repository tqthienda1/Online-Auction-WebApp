import * as BidServices from "../services/bid.service.js";
import * as ProductServices from "../services/product.service.js";
import prisma from "../prismaClient.js";

// export const placeBid = async (req, res) => {
//   try {
//     const { productId, maxPrice } = req.body;
//     const maxPriceNum = Number(maxPrice);
//     const userId = req.user;
//     const order = [{ maxPrice: "desc" }, { createdAt: "asc" }];

//     const allBids = await BidServices.getByProduct(productId, order);
//     const product = await ProductServices.getProductById(productId);

//     if (!product) {
//       return res.status(400).json({ message: "Product not found" });
//     }

//     if (maxPrice < product.currentPrice) {
//       return res
//         .status(400)
//         .json({ message: "Max price must be higher or equal current price" });
//     }

//     const result = await prisma.$transaction(async (tx) => {
//       const newBid = await BidServices.create(
//         userId,
//         productId,
//         maxPriceNum,
//         tx
//       );

//       const highest = allBids[0];
//       const second = allBids[1];

//       let currentPrice;

//       if (!second) {
//         currentPrice = product.startingPrice;
//       } else {
//         currentPrice =
//           highest.maxPrice >= newBid.maxPrice
//             ? newBid.maxPrice
//             : highest.maxPrice + product.bidStep;
//       }

//       const updatedProduct = await ProductServices.updateBidInfo(
//         productId,
//         userId,
//         currentPrice,
//         tx
//       );

//       return updatedProduct;
//     });

//     return res.status(200).json(result);
//   } catch (error) {
//     console.log(error.message);
//     return res.status(500).json({ message: "Server error" });
//   }
// };

export const placeBid = async (req, res) => {
  try {
    const { productId, maxPrice } = req.body;
    const userId = req.user.id;

    if (!productId || !maxPrice) {
      return res.status(400).json({ message: "Some information is missing." });
    }

    const result = await BidServices.placeBid({
      userId,
      productId,
      maxPrice: Number(maxPrice),
    });

    return res.status(200).json(result);
  } catch (err) {
    console.log("Place bid failed.", err.message);
    return res
      .status(err.status || 500)
      .json({ message: err.message || "Internal server error" });
  }
};
