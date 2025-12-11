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

export const getProductById = async (productId) => {
  const product = await prisma.product.findUnique({
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

export const updateProduct = async (userId, productId, descriptions) => {
  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: { sellerID: true, sold: true },
  });

  if (!product) {
    throw new Error("Product is not exist.");
  }

  console.log(userId);
  console.log(product.sellerID);

  if (userId != product.sellerID) {
    throw new Error(
      "Forbbiden. You are not authorized to repair this product."
    );
  }

  if (product.sold) {
    throw new Error("Product is sold.");
  }

  await prisma.productDescription.deleteMany({
    where: { productID: productId },
  });

  if (descriptions.length > 0) {
    await prisma.productDescription.createMany({
      data: descriptions.map((text) => ({
        productID: productId,
        productDescription: text,
      })),
    });
  }

  return await prisma.productDescription.findMany({
    where: { productID: productId },
    orderBy: { createdAt: "asc" },
  });
};
