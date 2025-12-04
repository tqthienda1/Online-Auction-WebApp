import prisma from "../prismaClient";

export const addDescription = async (productID, productDescription) => {
  try {
    if (productID === "" || description === "") {
      throw new Error("Add description failed: Data fields are missing!");
    }

    productExists = await prisma.product.findUnique({
      where: { id: productID },
    });

    if (!productExists) {
      throw new Error("Add description failed: Product not be found!");
    }

    const description = await prisma.productdescription.create({
      data: {
        productID,
        productDescription,
      },
    });
  } catch (error) {
    throw new Error("Add description failed: ", error);
  }
};
