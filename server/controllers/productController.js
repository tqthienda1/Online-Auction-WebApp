import prisma from "../prismaClient.js";
import { addDescription } from "../services/productDescription.service.js";
import { addProductImages } from "../services/productImages.service.js";
import { uploadFilesToSupabase } from "../services/supabase.service.js";

export const addProduct = async (req, res) => {
  try {
    const {
      productName,
      category,
      subCategory,
      startingPrice,
      bidStep,
      buyNowPrice,
      description,
      startDate,
      endDate,
      ratingRequired,
      autoExtend,
    } = req.body;

    const files = req.files;

    if (buyNowPrice) {
      if (Number(buyNowPrice) < 1) {
        return res.status(400).json({ message: "Buy now price min is 1!" });
      }
    }

    if (
      productName === "" ||
      category === "" ||
      Number(startingPrice) < 1 ||
      Number(bidStep) < 1 ||
      !files ||
      files.length < 3 ||
      description === "" ||
      startDate === "" ||
      endDate === ""
    ) {
      return res.status(400).json({ message: "Some data fields are missing!" });
    }

    const categoryExists = await prisma.category.findUnique({
      where: { name: category },
    });

    if (!categoryExists) {
      return res.status(400).json({ message: "Category not found!" });
    }

    if (subCategory !== "") {
      const subCategoryExists = await prisma.category.findUnique({
        where: { name: subCategory, parentID: categoryExists.id },
      });

      if (!subCategoryExists) {
        return res.status(400).json({ message: "Sub category not found!" });
      }
    }

    const productImages = await uploadFilesToSupabase(files);
    console.log(productImages);

    const product = await prisma.product.create({
      data: {
        seller: { connect: { id: req.user } },
        productName: productName,
        productAvt: productImages[0],
        category: {
          connect: { name: subCategory === "" ? category : subCategory },
        },
        startingPrice: Number(startingPrice),
        bidStep: Number(bidStep),
        buyNowPrice: Number(buyNowPrice) ?? null,
        startTime: new Date(startDate),
        endTime: new Date(endDate),
        autoExtend: Boolean(autoExtend),
        ratingRequired: Boolean(ratingRequired),
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
