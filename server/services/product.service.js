import prisma from "../prismaClient.js";

export const getProducts = async ({
  page,
  limit,
  search,
  category,
  minPrice,
  maxPrice,
  sortBy,
  order,
  sellerId,
}) => {
  const where = {
    name: search ? { contains: search, mode: "insensitive" } : undefined,

    category: category || undefined,

    sellerId: sellerId || undefined,

    price:
      minPrice || maxPrice
        ? {
            gte: minPrice ? Number(minPrice) : undefined,
            lte: maxPrice ? Number(maxPrice) : undefined,
          }
        : undefined,
  };

  const orderBy = {
    [sortBy]: order,
  };

  const skip = (page - 1) * limit;
  const take = limit;

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      skip,
      take,
      orderBy,
    }),
    prisma.product.count({ where }),
  ]);

  return {
    products,
    total,
  };
};

export const getProductById = async (productId, db = prisma) => {
  const product = await db.product.findUnique({
    where: { id: productId },
    include: {
      productImages: {
        orderBy: { order: "asc" },
      },
      productDescriptions: {
        orderBy: { createdAt: "asc" },
      },
      seller: true,
      category: true,
      bids: {
        orderBy: { createdAt: "desc" },
      },
      comments: {
        orderBy: { createdAt: "desc" },
      },
      rating: true,
      order: true,
    },
  });

  return product;
};

export const updateBidInfo = async (
  productId,
  highestBidderId,
  currentPrice,
  db = prisma
) => {
  const updatedProduct = await db.product.update({
    where: { id: productId },
    data: {
      currentPrice,
      highestBidderID: highestBidderId,
    },
  });

  return updatedProduct;
};
