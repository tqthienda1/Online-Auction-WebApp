import prisma from "../prismaClient.js";

export const CommentService = {
  async getById(id) {
    return await prisma.comment.findUnique({
      where: { id: id },
    });
  },

  async create(data) {
    return await prisma.comment.create({ data });
  },

  async update(id, data) {
    return await prisma.comment.update({
      where: { id: id },
      data,
    });
  },

  async delete(id) {
    return await prisma.comment.delete({
      where: { id: id },
    });
  },

  async getProductById(productId) {
    return await prisma.product.findUnique({
      where: { id: productId },
    });
  },
};
