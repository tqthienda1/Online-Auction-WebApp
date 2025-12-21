import prisma from "../prismaClient.js";

export const getUsers = async (page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  const [data, total] = await Promise.all([
    prisma.user.findMany({
      skip,
      take: limit,
      orderBy: { role: "desc" },
    }),
    prisma.user.count(),
  ]);

  return {
    data,
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  };
};

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
