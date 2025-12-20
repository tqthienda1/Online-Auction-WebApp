import prisma from "../prismaClient.js";

export const updateUsername = async (userId, username, address) => {
  return await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      username,
      address,
    },
  });
};

export const getInfo = async (userId) => {
  return await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });
};
