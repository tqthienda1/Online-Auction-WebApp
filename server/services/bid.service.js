import prisma from "../prismaClient.js";

export const create = async (userId, productId, maxPrice, db = prisma) => {
  return await db.bid.create({
    data: {
      product: productId,
      bidder: userId,
      maxPrice,
    },
  });
};

export const getByProduct = async (productId, order = [], db = prisma) => {
  return await db.bid.findMany({
    where: { productID: productId },
    orderBy: order,
  });
};
