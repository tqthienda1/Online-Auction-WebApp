import prisma from "../prismaClient.js";
import { addDescription } from "./productDescription.service.js";
import { addProductImages } from "./productImages.service.js";
import { uploadFilesToSupabase } from "../services/supabase.service.js";

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

export const addProduct = async (userId, body, files) => {
  const {
    productName,
    category,
    subCategory,
    startingPrice,
    bidStep,
    buyNowPrice,
    description,
    startDate,
    endDate,
    ratingRequired,
    autoExtend,
  } = body;

  if (buyNowPrice && Number(buyNowPrice) < 1) {
    throw new Error("Buy now price min is 1!");
  }

  if (
    !productName ||
    !category ||
    Number(startingPrice) < 1 ||
    Number(bidStep) < 1 ||
    !files ||
    files.length < 3 ||
    !description ||
    !startDate ||
    !endDate
  ) {
    throw new Error("Some data fields are missing!");
  }

  const categoryExists = await prisma.category.findUnique({
    where: { name: category },
  });

  if (!categoryExists) {
    throw new Error("Category not found!");
  }

  let finalCategoryName = category;

  if (subCategory) {
    const subCategoryExists = await prisma.category.findUnique({
      where: {
        name: subCategory,
      },
    });

    if (!subCategoryExists) {
      throw new Error("Sub category not found!");
    }

    finalCategoryName = subCategory;
  }

  const productImages = await uploadFilesToSupabase(files);

  const product = await prisma.product.create({
    data: {
      seller: { connect: { id: userId } },
      productName,
      productAvt: productImages[0],
      category: {
        connect: { name: finalCategoryName },
      },
      startingPrice: Number(startingPrice),
      bidStep: Number(bidStep),
      buyNowPrice: buyNowPrice ? Number(buyNowPrice) : null,
      startTime: new Date(startDate),
      endTime: new Date(endDate),
      autoExtend: Boolean(autoExtend),
      ratingRequired: Boolean(ratingRequired),
    },
  });

  await addDescription(product.id, description);

  await addProductImages(product.id, productImages);

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

export const deleteProduct = async (userId, productId) => {
  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: {
      sellerID: true,
      sold: true,
    },
  });

  if (!product) {
    throw new Error("Product does not exits");
  }

  if (product.sellerID != userId) {
    throw new Error(
      "Forbidden. You are not authorized to delete this product."
    );
  }

  if (product.sold) {
    throw new Error("Cannot delete product that has been sold");
  }

  await prisma.product.delete({
    where: { id: productId },
  });

  return { success: true };
};
