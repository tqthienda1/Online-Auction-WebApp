import prisma from "../prismaClient.js";

export const addProductImages = async (productID, productImages) => {
  if (productID === "" || productImages.length < 1) {
    throw new Error("Add images failed: Data fields are missing!");
  }

  const productExists = await prisma.product.findUnique({
    where: { id: productID },
  });

  if (!productExists) {
    throw new Error("Add images failed: Product not be found!");
  }

  const images = await prisma.ProductImage.createMany({
    data: productImages.map((item, index) => ({
      productID,
      imageURL: item,
      order: index,
    })),
  });
};
