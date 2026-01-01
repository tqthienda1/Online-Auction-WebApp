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
