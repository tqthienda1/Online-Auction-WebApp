import prisma from "../prismaClient.js";
import { addDescription } from "../services/productDescription.service.js";
import { addProductImages } from "../services/productImages.service.js";
import { uploadFilesToSupabase } from "../services/supabase.service.js";
import * as productService from "../services/product.service.js";

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
      console.log(files);
      console.log(typeof files);
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

export const getProducts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 9,
      search,
      category,
      minPrice,
      maxPrice,
      sortBy = "startTime",
      order = "desc",
      sellerId,
    } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);

    const { products, total } = await productService.getProducts({
      page: pageNum,
      limit: limitNum,
      search,
      category,
      minPrice,
      maxPrice,
      sortBy,
      order,
      sellerId,
    });

    return res.status(200).json({
      success: true,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
      data: products,
    });
  } catch (err) {
    console.log("Get /products fail: ", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res
        .status(400)
        .json({ success: false, message: "Product id is required." });
    }

    const product = await productService.getProductById(id);

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    return res.status(200).json({
      success: true,
      data: product,
    });
  } catch (err) {
    console.error("Get product by id is fail: ", err);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
