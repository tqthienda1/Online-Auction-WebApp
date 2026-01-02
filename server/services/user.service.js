import prisma from "../prismaClient.js";

export const getUsers = async ({ page = 1, limit = 10 }) => {
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

export const getUserRatings = async (userId) => {
  return await prisma.rating.findMany({
    where: {
      rateeID: userId,
    },
    include: {
      rater: {
        select: {
          id: true,
          username: true,
        },
      },
      product: {
        select: {
          id: true,
          productName: true,
        },
      },
    },
    orderBy: {
      productID: "desc",
    },
  });
};

export const getUserComments = async (userId) => {
  return await prisma.comment.findMany({
    where: {
      userID: userId,
      parentID: null,
    },
    include: {
      user: {
        select: {
          id: true,
          username: true,
        },
      },
      product: {
        select: {
          id: true,
          productName: true,
        },
      },
      childComments: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const updateExpiredSeller = async () => {
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const expireSellers = await prisma.upgradeRequest.findMany({
    where: {
      status: "ACCEPT",
      decidedTime: { lte: sevenDaysAgo },
    },
    select: {
      userID: true,
    },
  });

  const formatExpireSellers = expireSellers.map((user) => (user = user.userID));

  await prisma.user.updateMany({
    where: {
      id: { in: formatExpireSellers },
    },
    data: {
      role: "BIDDER",
    },
  });
};
