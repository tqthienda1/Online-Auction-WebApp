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
      where: { id: id },
      data,
    });
  },

  async delete(id) {
    return await prisma.category.delete({
      where: { id: id },
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
    const categories = await prisma.category.findMany({
      where: { parentID: null },
      include: {
        _count: {
          select: { product: true },
        },
        categoryChild: {
          include: {
            _count: {
              select: { product: true },
            },
          },
        },
      },
    });

    return categories.map((c) => ({
      id: c.id,
      name: c.name,
      total: c._count.product,
      categoryChild: c.categoryChild.map((child) => ({
        id: child.id,
        name: child.name,
        total: child._count.product,
      })),
    }));
  },
};
