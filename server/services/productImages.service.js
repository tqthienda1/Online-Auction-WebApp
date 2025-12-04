import prisma from "../prismaClient";

export const addProductImages = async (productID, productImages) => {
  try {
    if (productID === "" || productImages.length < 1) {
      throw new Error("Add images failed: Data fields are missing!");
    }

    productExists = await prisma.product.findUnique({
      where: { id: productID },
    });

    if (!productExists) {
      throw new Error("Add images failed: Product not be found!");
    }

    const images = await prisma.productimage.createMany({
      data: productImages.map((item, index) => ({
        productID,
        imageURL: item,
        order: index,
      })),
    });
  } catch (error) {
    throw new Error("Add images failed: ", error);
  }
};
