import prisma from "../prismaClient.js";

const ALLOWED_STATUS = ["PENDING", "ACCEPT", "FAILED"];

export const createUpgradeRequest = async (userId) => {
  const pending = await prisma.upgradeRequest.findFirst({
    where: { userID: userId, status: "PENDING" },
  });

  if (pending) {
    throw {
      status: 409,
      message: "You already have a pending upgrade request",
    };
  }

  return prisma.upgradeRequest.create({
    data: {
      userID: userId,
      status: "PENDING",
    },
  });
};

export const getMyUpgradeRequest = async (userId) => {
  return prisma.upgradeRequest.findFirst({
    where: { userID: userId },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const getAllUpgradeRequests = async (status) => {
  const where = {};

  if (status && !ALLOWED_STATUS.includes(status)) {
    throw {
      status: 400,
      message: "Invalid status filter",
    };
    where.status = status;
  }

  return prisma.upgradeRequest.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: {
          id: true,
          username: true,
          role: true,
        },
      },
    },
  });
};

export const approveUpgradeRequest = async ({ requestId, adminId }) => {
  return prisma.$transaction(async (tx) => {
    const request = await tx.upgradeRequest.findUnique({
      where: { id: requestId },
      include: {
        user: true,
      },
    });

    if (!request) {
      throw {
        status: 404,
        message: "Upgrade request not found.",
      };
    }

    if (request.status !== "PENDING") {
      throw {
        status: 409,
        message: "Upgrade request already processed",
      };
    }

    if (request.user.role === "SELLER") {
      throw {
        status: 400,
        message: "User is already a seller.",
      };
    }

    await tx.user.update({
      where: { id: request.userID },
      data: {
        role: "SELLER",
      },
    });

    await tx.upgradeRequest.update({
      where: { id: requestId },
      data: {
        status: "ACCEPT",
        decidedTime: new Date(),
      },
    });

    return {
      message: "Upgrade request approved.",
    };
  });
};

export const rejectUpgradeRequest = async ({ requestId, adminId }) => {
  return prisma.$transaction(async (tx) => {
    const request = await tx.upgradeRequest.findUnique({
      where: { id: requestId },
    });

    if (!request) {
      throw {
        status: 404,
        message: "Upgrade request not found.",
      };
    }

    if (request.status !== "PENDING") {
      throw {
        status: 409,
        message: "Upgrade request already processed",
      };
    }

    await tx.upgradeRequest.update({
      where: { id: requestId },
      data: {
        status: "FAILED",
        decidedTime: new Date(),
      },
    });

    return {
      message: "Upgrade request rejected.",
    };
  });
};
