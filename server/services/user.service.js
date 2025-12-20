import prisma from "../prismaClient.js";

export const UserService = {
  async getUsers({ page = 1, limit = 10 }) {
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
  },
};
