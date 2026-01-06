import prisma from "../prismaClient.js";
import { supabase } from "../libs/client.js";
import sgMail from "@sendgrid/mail";
import { sendMailTo } from "./sendMail.service.js";
import { generateMagicLink } from "./supabase.service.js";

export const placeBid = async ({ userId, productId, maxPrice }) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });

  const result = await prisma.$transaction(async (tx) => {
    const banned = await tx.bannedBidder.findUnique({
      where: {
        productID_bidderID: { productID: productId, bidderID: userId },
      },
    });

    if (banned) throw new Error("You are not allowed to bid on this product");

    const product = await tx.product.findUnique({
      where: { id: productId },
      include: { seller: true },
    });
    if (!product) throw { status: 400, message: "Product not found." };
    if (maxPrice < product.currentPrice + product.bidStep)
      throw { status: 400, message: "Bid too low." };

    const now = new Date();
    if (product.endTime <= now || product.sold)
      throw { status: 400, message: "Auction has ended." };
    if (now < product.startTime) {
      throw { status: 400, message: "Auction has not started yet" };
    }

    const oldHighestBidderID = product.highestBidderID;
    const oldCurrentPrice = product.currentPrice;

    if (product.ratingRequired) {
      const total = await tx.rating.count({
        where: { rateeID: userId },
      });

      if (total === 0) {
        throw new Error("This product requires bidders to have a rating.");
      }

      const positive = await tx.rating.count({
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
        bidder: { connect: { id: userId } },
        product: { connect: { id: productId } },
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

    let currentPrice = product.currentPrice;
    const highestChanged = highest.bidderID !== oldHighestBidderID;

    if (!highest) {
      currentPrice = product.startingPrice;
    } else if (!second) {
      currentPrice = product.startingPrice;
    } else {
      currentPrice = Math.min(
        highest.maxPrice,
        second.maxPrice + product.bidStep
      );
    }

    const priceChanged = currentPrice !== oldCurrentPrice;

    if (!oldHighestBidderID || priceChanged) {
      await tx.bidHistory.create({
        data: {
          productID: productId,
          bidderID: highest.bidderID,
          price: currentPrice,
        },
      });
    }

    const systemParam = await tx.systemParameter.findFirst();
    if (!systemParam) throw new Error("System parameters not configured");

    const remainingMs = product.endTime.getTime() - now.getTime();
    const thresholdMs = systemParam.autoExtendThreshold * 60 * 1000;
    let newEndTime = product.endTime;
    if (highestChanged && remainingMs <= thresholdMs && product.autoExtend) {
      newEndTime = new Date(
        product.endTime.getTime() + systemParam.autoExtendTime * 60 * 1000
      );
    }

    const updatedProduct = await tx.product.update({
      where: { id: productId },
      data: {
        currentPrice,
        highestBidderID: highest.bidderID,
        endTime: newEndTime,
      },
      include: { seller: true },
    });

    return {
      updatedProduct,
      priceChanged,
      highestChanged,
      oldHighestBidderID,
      newHighestBidderID: highest.bidderID,
    };
  });

  const {
    updatedProduct,
    priceChanged,
    highestChanged,
    oldHighestBidderID,
    newHighestBidderID,
  } = result;

  console.log(updatedProduct);

  if (priceChanged || highestChanged) {
    const seller = await supabase.auth.admin.getUserById(
      updatedProduct.seller.supabaseId
    );
    await sendMailTo(
      seller.data.user.email,
      `Your product "${updatedProduct.productName}" has a new bid!`,
      `Your product just received a new bid.\nCurrent price: ${updatedProduct.currentPrice}`,
      `<p>Your product just received a new bid.</p><p><b>Current price: ${updatedProduct.currentPrice}</b></p>`
    );

    const bidder = await supabase.auth.admin.getUserById(user.supabaseId);
    await sendMailTo(
      bidder.data.user.email,
      `You have placed a bid on "${updatedProduct.productName}" successfully`,
      `You successfully placed a bid.`,
      `<p>You successfully placed a bid.</p>`
    );
  }

  if (highestChanged && oldHighestBidderID) {
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    console.log(product);

    const oldHighestBidder = await prisma.user.findUnique({
      where: { id: oldHighestBidderID },
    });

    if (oldHighestBidder?.supabaseId) {
      const oldHighest = await supabase.auth.admin.getUserById(
        oldHighestBidder.supabaseId
      );
      const magicLink = await generateMagicLink(
        oldHighest.data.user.email,
        productId
      );

      console.log(productId);
      console.log(magicLink);

      await sendMailTo(
        oldHighest.data.user.email,
        `You have been outbid on "${product.productName}"`,
        `You have been outbid on "${product.productName}". See detail here: ${magicLink}`,
        `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <h2 style="color: #facc15;">You have been outbid on the product.</h2>
            <p>On: <strong>${product.productName}</strong></p>
            <a href="${magicLink}"
              style="
                display: inline-block;
                padding: 10px 20px;
                background-color: #facc15;
                color: white;
                text-decoration: none;
                border-radius: 5px;
                margin-top: 10px;
                font-weight: 600;
              ">
              See detail
            </a>
          </div>
        `
      );
    }
  }
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
