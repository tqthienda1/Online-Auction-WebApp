import prisma from "../prismaClient.js";
import { Prisma } from "@prisma/client";
import { addDescription } from "./productDescription.service.js";
import { addProductImages } from "./productImages.service.js";
import { uploadFilesToSupabase } from "../services/supabase.service.js";
import { checkWatchlist } from "./watchlist.service.js";
import { createOrder } from "./order.service.js";

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
  sold,
  user,
}) => {
  let categoryCondition = undefined;

  if (category) {
    const currentCategory = await prisma.category.findUnique({
      where: { id: category },
      select: { id: true, parentID: true },
    });

    if (currentCategory) {
      if (!currentCategory.parentID) {
        const children = await prisma.category.findMany({
          where: { parentID: currentCategory.id },
          select: { id: true },
        });

        categoryCondition = {
          in: children.map((c) => c.id),
        };
      } else {
        categoryCondition = category;
      }
    }
  }

  const where = {
    name: search ? { contains: search, mode: "insensitive" } : undefined,
    categoryID: categoryCondition,
    sellerId: sellerId || undefined,
    currentPrice:
      minPrice || maxPrice
        ? {
            gte: minPrice ? Number(minPrice) : undefined,
            lte: maxPrice ? Number(maxPrice) : undefined,
          }
        : undefined,
    sold: false,
  };

  const orderBy =
    sortBy === "totalBid"
      ? { bids: { _count: order === "asc" ? "asc" : "desc" } }
      : { [sortBy]: order === "asc" ? "asc" : "desc" };

  const skip = (page - 1) * limit;

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      skip,
      take: limit,
      orderBy,
      include: {
        _count: { select: { bids: true } },
        category: { select: { name: true } },
        highestBidder: { select: { id: true, username: true } },
      },
    }),
    prisma.product.count({ where }),
  ]);

  return {
    products: await Promise.all(
      products.map(async (p) => ({
        ...p,
        category: p.category?.name ?? null,
        isLiked: await checkWatchlist(user, p.id),
      }))
    ),
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
      // bids: {
      //   orderBy: { createdAt: "desc" },
      //   include: {
      //     bidder: {
      //       select: { id: true, username: true },
      //     },
      //   },
      // },
      comments: {
        orderBy: { createdAt: "desc" },
        include: {
          user: {
            select: {
              username: true,
            },
          },
        },
      },
      highestBidder: true,
      rating: true,
      order: true,
      inWatchList: true,
    },
  });

  if (!product) return null;

  const relatedProducts = await db.product.findMany({
    where: {
      categoryID: product.categoryID,
      id: { not: product.id },
      sold: false,
    },
    select: {
      id: true,
      productName: true,
      productAvt: true,
      currentPrice: true,
      startingPrice: true,
      buyNowPrice: true,
      endTime: true,
    },
    take: 5,
  });
  return { ...product, relatedProducts };
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
      currentPrice: Number(startingPrice),
      startingPrice: Number(startingPrice),
      bidStep: Number(bidStep),
      buyNowPrice: buyNowPrice ? Number(buyNowPrice) : null,
      startTime: new Date(startDate),
      endTime: new Date(endDate),
      autoExtend: autoExtend === "true",
      ratingRequired: ratingRequired === "true",
    },
  });

  await Promise.all([
    addDescription(product.id, description),
    addProductImages(product.id, productImages),
  ]);

  return product;
};

export const updateProduct = async (userId, productId, descriptions) => {
  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: { sellerID: true, sold: false },
  });

  if (!product) {
    throw new Error("Product is not exist or has been sold.");
  }

  if (userId != product.sellerID) {
    throw new Error(
      "Forbbiden. You are not authorized to repair this product."
    );
  }

  await prisma.productDescription.create({
    data: {
      productID: productId,
      productDescription: descriptions,
    },
  });

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

export const getBidHistory = async (productId) => {
  const histories = await prisma.bidHistory.findMany({
    where: { productID: productId },
    orderBy: { createdAt: "desc" },
    include: {
      User: {
        select: {
          id: true,
          username: true,
        },
      },
    },
  });

  // map to shape frontend expects: include `bidder` object
  return histories.map((h) => ({
    id: h.id,
    productID: h.productID,
    bidderID: h.bidderID,
    price: h.price,
    createdAt: h.createdAt,
    bidder: h.User || null,
  }));
};

export const getAuction = async (productId) => {
  return prisma.product.findUnique({
    where: { id: productId },
    select: {
      currentPrice: true,
      highestBidder: {
        select: {
          id: true,
          username: true,
          ratingPos: true,
          ratingNeg: true,
        },
      },
    },
  });
};

export const getProductDescriptions = async (productId) => {
  return prisma.productDescription.findMany({
    where: { productID: productId },
    orderBy: { createdAt: "asc" },
  });
};

export const closeExpiredAuctions = async () => {
  const now = new Date();

  const products = await prisma.product.findMany({
    where: {
      endTime: { lte: now },
      sold: false,
    },
  });

  for (const product of products) {
    await prisma.$transaction(async (tx) => {
      const existingOrder = await tx.order.findUnique({
        where: { productID: product.id },
      });

      if (!existingOrder && product.highestBidderID)
        await createOrder({
          db: tx,
          productID: product.id,
          sellerID: product.sellerID,
          buyerID: product.highestBidderID,
        });

      await tx.product.update({
        where: { id: product.id, sold: false }, // tránh race condition
        data: { sold: true },
      });
    });
  }
};

export const fullTextSearch = async (
  keyword,
  minPrice,
  maxPrice,
  sortBy = "rank",
  order = "desc",
  page = 1,
  limit = 10
) => {
  const offset = (page - 1) * limit;
  const orderByField =
    sortBy === "price"
      ? Prisma.sql`rp."currentPrice"`
      : sortBy === "startTime"
      ? Prisma.sql`rp."startTime"`
      : Prisma.sql`rp.rank`;

  const orderDirection = order === "asc" ? Prisma.sql`ASC` : Prisma.sql`DESC`;

  return await prisma.$queryRaw`
    WITH ranked_products AS (
      SELECT
        p.id,
        p."sellerID",
        p."highestBidderID",
        p."productName",
        p."productAvt",
        p."categoryID",
        p."startingPrice",
        p."bidStep",
        p."buyNowPrice",
        p."currentPrice",
        p."startTime",
        p."endTime",
        p."autoExtend",
        p."sold",
        p."ratingRequired",
        ts_rank(p.search_vector, q) AS rank
      FROM "Product" p
      CROSS JOIN plainto_tsquery('english', ${keyword}::text) q
      WHERE
        p.search_vector @@ q
        AND p.sold = false
        AND p."endTime" > now()
        AND (${minPrice}::int IS NULL OR p."currentPrice" >= ${minPrice})
        AND (${maxPrice}::int IS NULL OR p."currentPrice" <= ${maxPrice})
    )
    SELECT
      rp.*,
      c.name AS category_name,
      u.id AS highest_bidder_id,
      u.username AS highest_bidder_username,
      (
        SELECT COUNT(*)::int
        FROM "Bid" b
        WHERE b."productID" = rp.id
      ) AS bid_count
    FROM ranked_products rp
    LEFT JOIN "Category" c ON c.id = rp."categoryID"
    LEFT JOIN "User" u ON u.id = rp."highestBidderID"
    ORDER BY ${orderByField} ${orderDirection}
    LIMIT ${limit}
    OFFSET ${offset}
  `;
};
