import prisma from '../prismaClient.js'

export const createOrder = async ({ productID, sellerID, buyerID }) => {
  const order = await prisma.order.create({
    data: {
      product: { connect: { id: productID } },
      buyer: { connect: { id: buyerID } },
      seller: { connect: { id: sellerID } },
      status: 'CREATED',
    },
  })

  await prisma.product.update({
    where: { id: productID },
    data: { sold: true },
  })

  return order
}

export const getOrderByProduct = async (productID) => {
  return prisma.order.findUnique({
    where: { productID },
    include: { buyer: true, seller: true, product: true },
  })
}

export const updateBuyerInfo = async (productID, paymentInvoice, shippingAddress) => {
  return prisma.order.update({
    where: { productID },
    data: {
      paymentInvoice,
      shippingAddress,
      status: 'PROVIDEBUYERINFO',
    },
  })
}

export const updateShippingInvoice = async (productID, shippingInvoice) => {
  return prisma.order.update({
    where: { productID },
    data: {
      shippingInvoice,
      status: 'UPDATESHIPPINGINVOICE',
    },
  })
}

export const confirmPaymentReceived = async (productID) => {
  return prisma.order.update({
    where: { productID },
    data: { status: 'RECEIVEPAYMENT' },
  })
}

export const confirmProductReceived = async (productID) => {
  return prisma.order.update({
    where: { productID },
    data: { status: 'RECEIVEPRODUCT' },
  })
}

export const cancelOrder = async (productID) => {
  const updatedOrder = await prisma.order.update({
    where: { productID },
    data: { status: 'CANCELORDER' },
  })

  await prisma.product.update({
    where: { id: productID },
    data: { sold: false },
  })

  return updatedOrder
}
