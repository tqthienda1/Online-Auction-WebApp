import prisma from "../prismaClient.js";

export const placeBid = async ({ userId, productId, maxPrice }) => {
  return prisma.$transaction(async (tx) => {
    const product = await tx.product.findUnique({
      where: { id: productId },
      // lock: { mode: "ForUpdate" },
    });

    if (!product) {
      throw { status: 400, message: "Product not found." };
    }

    if (maxPrice < product.currentPrice + product.bidStep) {
      throw { status: 400, message };
    }
    const now = new Date();

    if (product.endTime <= now) {
      throw { status: 400, message: "Auction has ended." };
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

    const systemParam = await tx.systemParameter.findFirst();

    if (!systemParam) {
      throw new Error("System parameters not configured");
    }

    const remainingMs = product.endTime.getTime() - now.getTime();

    const thresholdMs = systemParam.autoExtendThreshold * 60 * 1000;

    const isMeaningfulBid =
      highest.bidderID !== product.highestBidderID ||
      currentPrice !== product.currentPrice;

    if (isMeaningfulBid && remainingMs <= thresholdMs && product.autoExtend) {
      product.endTime = new Date(
        product.endTime.getTime() + systemParam.autoExtendTime * 60 * 1000
      );
      console.log(product.endTime);
    }

    return tx.product.update({
      where: { id: productId },
      data: {
        currentPrice,
        highestBidderID: highest.bidderID,
        endTime: product.endTime,
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
