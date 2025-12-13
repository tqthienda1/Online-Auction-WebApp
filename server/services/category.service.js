import prisma from "../prismaClient.js";

export const CategoryService = {
  async getAll() {
    return await prisma.category.findMany();
  },

  async getById(id) {
    return await prisma.category.findUnique({
      where: { id },
      include: {
        categoryChild: true,
        product: true,
      },
    });
  },

  async create(data) {
    const existed = await prisma.category.findFirst({
      where: { name: data.name },
    });
    if (existed) {
      return null;
    } else {
      return await prisma.category.create({ data });
    }
  },

  async update(id, data) {
    return await prisma.category.update({
      where: { id },
      data,
    });
  },

  async delete(id) {
    return await prisma.category.delete({
      where: { id },
    });
  },

  async getParentCategories() {
    return await prisma.category.findMany({
      where: { parentID: null },
    });
  },

  async getChildrenCategories(parentID) {
    return await prisma.category.findMany({
      where: { parentID },
    });
  },

  async getTree() {
    return await prisma.category.findMany({
      where: { parentID: null },
      include: { categoryChild: true },
    });
  },

  async getCategoryWithProducts(id) {
    return await prisma.category.findUnique({
      where: { id },
      include: {
        product: true,
      },
    });
  },
};
