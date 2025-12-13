import prisma from "../prismaClient.js";

export const AdminService = {
  async getUsersCount() {
    return await prisma.user.count();
  },

  async getCategoriesCount() {
    return await prisma.category.count({
      where: { parentID: null },
    });
  },

  async getProductsCount() {
    return await prisma.product.count();
  },

  async getRequestsCount() {
    return await prisma.upgradeRequest.count();
  },
};
