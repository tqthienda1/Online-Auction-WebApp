import prisma from "../prismaClient.js";
import { addDescription } from "../services/productDescription.service.js";
import { addProductImages } from "../services/productImages.service.js";

export const addProduct = async (req, res) => {
  try {
    const {
      productName,
      category,
      subCategory,
      startingPrice,
      bidStep,
      buyNowPrice,
      productImages,
      description,
      startDate,
      endDate,
      ratingRequired,
      autoExtend,
    } = req.body;

    if (
      productName === "" ||
      category === "" ||
      subCategory === "" ||
      startingPrice < 1 ||
      bidStep < 1 ||
      productImages.length < 3 ||
      description === "" ||
      startDate === "" ||
      endDate === "" ||
      (buyNowPrice && buyNowPrice < 1)
    ) {
      return res.status(400).json({ message: "Some data fields are missing!" });
    }

    const categoryExists = await prisma.category.findUnique({
      where: { name: category },
    });

    if (!categoryExists) {
      return res.status(400).json({ message: "Category not found!" });
    }

    const subCategoryExists = await prisma.category.findUnique({
      where: { name: subCategory, parentID: categoryExists.id },
    });

    if (!subCategoryExists) {
      return res.status(400).json({ message: "Sub category not found!" });
    }

    const product = await prisma.product.create({
      data: {
        sellerID: req.user,
        productName: productName,
        productAvt: productImages[0],
        category: { connect: { name: category } },
        startingPrice: startingPrice,
        bidStep: bidStep,
        buyNowPrice: buyNowPrice ?? null,
        startTime: new Date(startDate),
        endTime: new Date(endDate),
        autoExtend: autoExtend,
        ratingRequired: ratingRequired,
      },
    });

    await addDescription(product.id, description);
    await addProductImages(product.id, productImages);

    return res.status(201).json(product);
  } catch (error) {
    console.error("Add product fail: ", error);
    return res.status(500).json({ message: "Server error." });
  }
};
