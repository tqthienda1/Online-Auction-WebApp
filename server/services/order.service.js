import { OrderStatus } from "@prisma/client";
import prisma from "../prismaClient.js";

// Status represents the NEXT action/state needed
// CREATED -> waiting for buyer to provide info
// PROVIDEBUYERINFO -> waiting for seller to confirm payment
// RECEIVEPAYMENT -> waiting for seller to upload shipping invoice
// UPDATESHIPPINGINVOICE -> waiting for buyer to confirm product received
// RECEIVEPRODUCT -> product received, now waiting for rating
// RATING -> rating completed, order finished

const ORDER_STATUS_SEQUENCE = [
  "CREATED",
  "PROVIDEBUYERINFO",
  "RECEIVEPAYMENT",
  "UPDATESHIPPINGINVOICE",
  "RECEIVEPRODUCT",
  "RATING",
];

const validateStatusTransition = (currentStatus, expectedNextStatus) => {
  const currentIndex = ORDER_STATUS_SEQUENCE.indexOf(currentStatus);

  if (currentIndex === -1) {
    throw { status: 400, message: `Invalid current status: ${currentStatus}` };
  }

  // Next status in sequence
  const nextStatus = ORDER_STATUS_SEQUENCE[currentIndex + 1];

  if (!nextStatus) {
    throw { status: 400, message: `Order has already completed` };
  }

  if (nextStatus !== expectedNextStatus) {
    throw {
      status: 400,
      message: `Expected next status ${nextStatus}, but got ${expectedNextStatus}`,
    };
  }
};

export const createOrder = async ({
  db = prisma,
  productID,
  sellerID,
  buyerID,
}) => {
  const order = await db.order.create({
    data: {
      product: { connect: { id: productID } },
      buyer: { connect: { id: buyerID } },
      seller: { connect: { id: sellerID } },
      status: "CREATED", // waiting for buyer to provide info
    },
  });

  return order;
};

export const getOrderByProduct = async (productID) => {
  return prisma.order.findUnique({
    where: { productID },
    include: { buyer: true, seller: true, product: true },
  });
};

export const updateBuyerInfo = async (
  productID,
  paymentInvoice,
  shippingAddress
) => {
  const order = await prisma.order.findUnique({
    where: { productID },
  });

  if (!order) {
    throw { status: 404, message: "Order not found" };
  }

  // Buyer provides info; transition from CREATED to PROVIDEBUYERINFO (seller must now confirm payment)
  validateStatusTransition(order.status, "PROVIDEBUYERINFO");

  return prisma.order.update({
    where: { productID },
    data: {
      paymentInvoice,
      shippingAddress,
      status: "PROVIDEBUYERINFO", // now waiting for seller to confirm payment
    },
  });
};

export const confirmPaymentReceived = async (productID) => {
  const order = await prisma.order.findUnique({
    where: { productID },
  });

  if (!order) {
    throw { status: 404, message: "Order not found" };
  }

  // Seller confirms payment; transition from PROVIDEBUYERINFO to RECEIVEPAYMENT (seller must now upload shipping)
  validateStatusTransition(order.status, "RECEIVEPAYMENT");

  return prisma.order.update({
    where: { productID },
    data: { status: "RECEIVEPAYMENT" }, // now waiting for seller to upload shipping invoice
  });
};

export const updateShippingInvoice = async (productID, shippingInvoice) => {
  const order = await prisma.order.findUnique({
    where: { productID },
  });

  if (!order) {
    throw { status: 404, message: "Order not found" };
  }

  // Seller uploads shipping; transition from RECEIVEPAYMENT to UPDATESHIPPINGINVOICE (buyer must now confirm receipt)
  validateStatusTransition(order.status, "UPDATESHIPPINGINVOICE");

  return prisma.order.update({
    where: { productID },
    data: {
      shippingInvoice,
      status: "UPDATESHIPPINGINVOICE", // now waiting for buyer to confirm product received
    },
  });
};

export const confirmProductReceived = async (productID) => {
  const order = await prisma.order.findUnique({
    where: { productID },
  });

  if (!order) {
    throw { status: 404, message: "Order not found" };
  }

  validateStatusTransition(order.status, "RECEIVEPRODUCT");

  return prisma.order.update({
    where: { productID },
    data: { status: "RECEIVEPRODUCT" },
  });
};
export const cancelOrder = async (productID) => {
  const order = await prisma.order.findUnique({
    where: { productID },
  });

  if (!order) {
    throw { status: 404, message: "Order not found" };
  }

  const updatedOrder = await prisma.order.update({
    where: { productID },
    data: { status: "CANCELORDER" },
  });

  await prisma.product.update({
    where: { id: productID },
    data: { sold: false },
  });

  return updatedOrder;
};

export const getWonOrdersByUser = async (userId, page = 1, limit = 10) => {
  try {
    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where: { buyerID: userId },
        skip,
        take: limit,
        include: {
          product: true, // Lấy toàn bộ thông tin product
          seller: {
            select: {
              id: true,
              username: true,
            },
          },
        },
        // Nếu database chưa có cột createdAt, hãy comment dòng orderBy này lại
        // orderBy: { createdAt: 'desc' }
      }),
      prisma.order.count({ where: { buyerID: userId } }),
    ]);

    return {
      // Sửa 'product.map' thành 'orders.map'
      orders: orders.map((item) => ({
        ...item.product, // Trải dữ liệu sản phẩm ra ngoài
        orderStatus: item.status, // Thêm trạng thái đơn hàng để FE xử lý
        sellerName: item.seller?.username,
        // addedToWonlistAt: item.createdAt // Chỉ mở nếu DB đã có cột này
      })),
      total,
    };
  } catch (error) {
    throw {
      status: 500,
      message: error.message || "Failed to fetch won orders",
    };
  }
};

export const createBuyNow = async ({ productId, buyerId }) => {
  return await prisma.$transaction(async (tx) => {
    const product = await tx.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new Error("Product not found");
    }

    if (product.sold) {
      throw new Error("Product already sold.");
    }

    // if (product.isExpired) {
    //   throw new Error("Product already ended.");
    // }

    if (!product.buyNowPrice) {
      throw new Error("Product does not support buy now.");
    }

    if (new Date(product.endTime) < new Date()) {
      throw new Error("Auction already ended");
    }

    if (product.sellerID === buyerId) {
      throw new Error("Seller cannot buy their own product");
    }

    const banned = await tx.bannedBidder.findUnique({
      where: {
        productID_bidderID: {
          productID: productId,
          bidderID: buyerId,
        },
      },
    });

    if (banned) {
      throw new Error("You are banned from this product");
    }

    if (product.ratingRequired) {
      const total = await tx.rating.count({
        where: { rateeID: buyerId },
      });

      if (total === 0) {
        throw new Error("This product requires bidders to have a rating.");
      }

      const positive = await tx.rating.count({
        where: { rateeID: buyerId, isPos: true },
      });

      if (positive / total < 0.8) {
        throw new Error(
          "Your rating is below 80%. You are not allowed to place a bid on this product."
        );
      }
    }

    const order = await tx.order.create({
      data: {
        productID: product.id,
        buyerID: buyerId,
        sellerID: product.sellerID,
        status: "CREATED",
      },
    });

    const priceChanged =
      product.currentPrice === null ||
      product.buyNowPrice !== product.currentPrice;

    if (priceChanged) {
      await tx.bidHistory.create({
        data: {
          productID: product.id,
          bidderID: buyerId,
          price: product.buyNowPrice,
        },
      });
    }

    await tx.product.update({
      where: { id: product.id },
      data: {
        sold: true,
        endTime: new Date(),
        currentPrice: product.buyNowPrice,
        highestBidderID: buyerId,
        isExpired: true,
      },
    });

    return order;
  });
};
