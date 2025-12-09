import prisma from "../prismaClient.js";

export const create = async (userId, productId, maxPrice) => {
  try {
    return await prisma.bid.create({
      product: productId,
      bidder: userId,
      maxPrice,
    });
  } catch (error) {
    return error.message;
  }
};

export const getByProduct = async (productId, order = []) => {
  try {
    return await prisma.bid.findMany({
      where: { productID: productId },
      orderBy: order,
    });
  } catch (error) {}
};
