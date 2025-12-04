import prisma from "../prismaClient.js";

export const addDescription = async (productID, productDescription) => {
  try {
    if (productID === "" || productDescription === "") {
      throw new Error("Add description failed: Data fields are missing!");
    }

    const productExists = await prisma.product.findUnique({
      where: { id: productID },
    });

    if (!productExists) {
      throw new Error("Add description failed: Product not be found!");
    }

    const description = await prisma.ProductDescription.create({
      data: {
        productID,
        productDescription,
      },
    });
  } catch (error) {
    throw new Error(`Add description failed: ${error}`);
  }
};
