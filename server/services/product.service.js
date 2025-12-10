import prisma from "../prismaClient.js";

export const ProductService = {
  async getByCategory(categoryID, filters) {
    const { skip, limit, minPrice, maxPrice } = filters;
    console.log(filters);

    const sortOptions = {
      "price-asc": { currentPrice: "asc" },
      "price-desc": { currentPrice: "desc" },
      "name-asc": { productName: "asc" },
      "name-desc": { productName: "desc" },
      default: { startTime: "desc" },
    };

    const products = await prisma.product.findMany({
      where: {
        categoryID,
        currentPrice: {
          gte: minPrice,
          lte: maxPrice,
        },
      },
      skip,
      take: limit,

      include: {
        category: true,
      },
    });

    const total = await prisma.product.count({
      where: {
        categoryID,
        currentPrice: { gte: minPrice, lte: maxPrice },
      },
    });

    return { products, total };
  },
};
