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
    const hasChildren = await prisma.category.findFirst({
      where: { parentID: id },
      select: { id: true },
    });

    if (hasChildren) {
      throw new Error("CATEGORY_HAS_CHILDREN");
    }

    const hasProducts = await prisma.product.findFirst({
      where: { categoryID: id },
      select: { id: true },
    });

    if (hasProducts) {
      throw new Error("CATEGORY_HAS_PRODUCTS");
    }

    return prisma.category.delete({ where: { id } });
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

  async getCategories({ page = 1, limit = 10 }) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      prisma.category.findMany({
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
        skip,
        take: limit,
        orderBy: { name: "desc" },
      }),
      prisma.category.count({ where: { parentID: null } }),
    ]);

    const formattedData = data.map((c) => ({
      id: c.id,
      name: c.name,
      total: c._count.product,
      categoryChild: c.categoryChild.map((child) => ({
        id: child.id,
        name: child.name,
        total: child._count.product,
      })),
    }));

    return {
      data: formattedData,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    };
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
