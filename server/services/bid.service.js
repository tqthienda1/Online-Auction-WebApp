import prisma from "../prismaClient.js";

export const placeBid = async ({ userId, productId, maxPrice }) => {
  return prisma.$transaction(async (tx) => {
    const product = await tx.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw { status: 400, message: "Product not found." };
    }

    if (maxPrice < product.currentPrice) {
      throw { status: 400, message };
    }

    await tx.bid.create({
      data: {
        maxPrice,
        bidder: {
          connect: { id: userId },
        },
        product: {
          connect: { id: productId },
        },
      },
    });

    const topTwo = await tx.bid.findMany({
      where: { productID: productId },
      orderBy: [{ maxPrice: "desc" }, { createdAt: "asc" }],
      take: 2,
    });

    const highest = topTwo[0];
    const second = topTwo[1];

    let currentPrice;

    if (!second) {
      currentPrice = product.startingPrice;
    } else {
      currentPrice = Math.min(
        highest.maxPrice,
        second.maxPrice + product.bidStep
      );
    }

    if (
      highest.bidderID !== product.highestBidderID ||
      currentPrice !== product.currentPrice
    ) {
      await tx.bidHistory.create({
        data: {
          productID: productId,
          bidderID: highest.bidderID,
          price: currentPrice,
        },
      });
    }

    return tx.product.update({
      where: { id: productId },
      data: {
        currentPrice,
        highestBidderID: highest.bidderID,
      },
    });
  });
};

export const create = async (userId, productId, maxPrice, db = prisma) => {
  return await db.bid.create({
    data: {
      product: { connect: { id: productId } },
      bidder: { connect: { id: userId } },
      maxPrice,
    },
  });
};

export const getByProduct = async (productId, order = [], db = prisma) => {
  return await db.bid.findMany({
    where: {
      product: {
        id: productId,
      },
    },
    orderBy: order,
  });
};
