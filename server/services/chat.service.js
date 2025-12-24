import prisma from '../prismaClient.js'

export const sendMessage = async ({ productID, senderID, receiverID, content }) => {
  if (!content || content.trim() === '') {
    throw { status: 400, message: 'Message content cannot be empty' };
  }

  const msg = await prisma.message.create({
    data: { productID, senderID, receiverID, content },
  });

  return msg;
};

export const getMessages = async (productID, { limit = 100, after } = {}) => {
  const where = { productID };
  const messages = await prisma.message.findMany({
    where,
    orderBy: { createdAt: 'asc' },
    take: limit,
  });

  return messages;
};

export default { sendMessage, getMessages };
