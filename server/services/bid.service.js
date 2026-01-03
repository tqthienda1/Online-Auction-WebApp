import prisma from "../prismaClient.js";

export const placeBid = async ({ userId, productId, maxPrice }) => {
  return prisma.$transaction(async (tx) => {
    const banned = await prisma.bannedBidder.findUnique({
      where: {
        productID_bidderID: {
          productID: productId,
          bidderID: userId,
        },
      },
    });

    if (banned) {
      throw new Error("You are not allowed to bid on this product");
    }
    const product = await tx.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw { status: 400, message: "Product not found." };
    }

    if (maxPrice < product.currentPrice + product.bidStep) {
      throw { status: 400, message: "Bid too low." };
    }
    const now = new Date();

    if (product.endTime <= now) {
      throw { status: 400, message: "Auction has ended." };
    }

    if (product.ratingRequired) {
      const total = await prisma.rating.count({
        where: { rateeID: userId },
      });

      if (total === 0) {
        throw new Error("This product requires bidders to have a rating.");
      }

      const positive = await prisma.rating.count({
        where: { rateeID: userId, isPos: true },
      });

      if (positive / total < 0.8) {
        throw new Error(
          "Your rating is below 80%. You are not allowed to place a bid on this product."
        );
      }
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

    const bannedIds = await tx.bannedBidder.findMany({
      where: { productID: productId },
      select: { bidderID: true },
    });

    const topTwo = await tx.bid.findMany({
      where: {
        productID: productId,
        bidderID: { notIn: bannedIds.map((b) => b.bidderID) },
      },
      orderBy: [{ maxPrice: "desc" }, { createdAt: "asc" }],
      take: 2,
    });

    const highest = topTwo[0];
    const second = topTwo[1];

    const highestChanged =
      product.highestBidderID && highest.bidderID !== product.highestBidderID;

    let currentPrice = product.currentPrice;

    if (highestChanged) {
      if (!second) {
        currentPrice = product.startingPrice;
      } else {
        currentPrice = Math.min(
          highest.maxPrice,
          second.maxPrice + product.bidStep
        );
      }
    }

    const isFirstBid = !product.highestBidderID;
    const priceChanged = currentPrice !== product.currentPrice;

    const shouldWriteHistory = isFirstBid || priceChanged;

    if (shouldWriteHistory) {
      await tx.bidHistory.create({
        data: {
          productID: productId,
          bidderID: highest.bidderID,
          price: currentPrice,
        },
      });
    }

    const systemParam = await tx.systemParameter.findFirst();

    if (!systemParam) {
      throw new Error("System parameters not configured");
    }

    const remainingMs = product.endTime.getTime() - now.getTime();

    const thresholdMs = systemParam.autoExtendThreshold * 60 * 1000;

    let newEndTime = product.endTime;

    if (highestChanged && remainingMs <= thresholdMs && product.autoExtend) {
      newEndTime = new Date(
        product.endTime.getTime() + systemParam.autoExtendTime * 60 * 1000
      );
    }

    return tx.product.update({
      where: { id: productId },
      data: {
        currentPrice,
        highestBidderID: highest.bidderID,
        endTime: newEndTime,
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

export const getBiddingProducts = async (userId, db = prisma) => {
  const now = new Date();

  // Get all bids placed by the user
  const userBids = await db.bid.findMany({
    where: {
      bidderID: userId,
    },
    select: {
      productID: true,
    },
  });

  // Get unique product IDs
  const productIds = [...new Set(userBids.map((bid) => bid.productID))];

  if (productIds.length === 0) {
    return [];
  }

  // Get all products where user has bid, still active (not expired, not sold)
  const products = await db.product.findMany({
    where: {
      id: {
        in: productIds,
      },
      sold: false,
      endTime: {
        gt: now,
      },
    },
    include: {
      _count: { select: { bids: true } },
      category: { select: { name: true } },
      highestBidder: { select: { id: true, username: true } },
    },
    orderBy: {
      endTime: "asc",
    },
  });

  return products.map((p) => ({
    ...p,
    category: p.category?.name ?? null,
    totalBid: p._count.bids,
    _count: undefined,
  }));
};
