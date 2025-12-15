import prisma from "../prismaClient.js";
import { addDescription } from "../services/productDescription.service.js";
import { addProductImages } from "../services/productImages.service.js";
import { uploadFilesToSupabase } from "../services/supabase.service.js";
import * as productService from "../services/product.service.js";

export const addProduct = async (req, res) => {
  console.log(req.body);
  try {
    const userId = req.user.id;
    const files = req.files;
    const body = req.body;

    const product = await productService.addProduct(userId, body, files);

    return res
      .status(201)
      .json({ message: "Product created successfully", product });
  } catch (error) {
    console.error("Add product error:", error);

    const msg = error.message || "Internal server error";

    if (msg.includes("not found"))
      return res.status(404).json({ message: msg });

    if (msg.includes("missing") || msg.includes("min"))
      return res.status(400).json({ message: msg });

    return res.status(500).json({ message: msg });
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
      sold,
    } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const soldValue = sold === "true" ? true : false;

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
      sold: soldValue,
    });

    const result = products.map((p) => ({
      ...p,
      totalBid: p._count.bids,
      _count: undefined,
    }));

    return res.status(200).json({
      success: true,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
      data: result,
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
      return res.status(400).json({ message: "Product id is required." });
    }

    const product = await productService.getProductById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.status(200).json({
      data: product,
    });
  } catch (err) {
    console.error("Get product by id is fail: ", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { descriptions } = req.body;
    const userId = req.user?.id;

    if (!Array.isArray(descriptions)) {
      return res.status(400).json({ message: "Descriptions must be an array" });
    }

    if (!id) {
      return res.status(400).json({ message: "Product id is required." });
    }

    const product = await productService.updateProduct(
      userId,
      id,
      descriptions
    );

    res.status(200).json({ message: "Update product successful." });
  } catch (err) {
    console.error("Update product is fail:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    if (!id) {
      return res.status(400).json({ message: "Product id is require." });
    }

    const result = await productService.deleteProduct(userId, id);

    res.status(200).json({ message: "Product deleted successfully." });
  } catch (err) {
    console.error("Delete product error:", err);

    const msg = err.message || "Internal server error";

    if (msg.includes("does not exist"))
      return res.status(404).json({ message: msg });

    if (msg.includes("Forbidden"))
      return res.status(403).json({ message: msg });

    if (msg.includes("sold")) return res.status(400).json({ message: msg });

    res.status(500).json({ message: "Internal server error" });
  }
};
