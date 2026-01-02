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

    const user = req.user?.id;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const soldValue =
      sold === "true" ? true : sold === "false" ? false : undefined;

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
      user,
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

    if (!descriptions) {
      return res.status(400).json({ message: "Descriptions are required." });
    }

    if (!id) {
      return res.status(400).json({ message: "Product id is required." });
    }

    const product = await productService.updateProduct(
      userId,
      id,
      descriptions
    );

    res.status(200).json(product);
  } catch (err) {
    console.error("Update product is fail:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    console.log(userId);
    console.log(id);

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

export const getProductBidHistory = async (req, res) => {
  try {
    const productId = req.params.id;

    const bidHistory = await productService.getBidHistory(productId);

    return res.status(200).json({
      success: true,
      bidHistories: bidHistory,
    });
  } catch (err) {
    console.log("Get bid history failed", err.message);
    return res
      .status(err.status || 500)
      .json({ message: err.message || "Internal server error" });
  }
};

export const getProductAuction = async (req, res) => {
  try {
    const productId = req.params.id;

    const { currentPrice, highestBidder } = await productService.getAuction(
      productId
    );

    return res.status(200).json({
      currentPrice,
      highestBidder,
    });
  } catch (err) {
    console.log("Get product auction failed", err.message);
    return res
      .status(err.status || 500)
      .json({ message: err.message || "Internal server error" });
  }
};

export const getProductDescriptions = async (req, res) => {
  try {
    const productId = req.params.id;

    const descriptions = await productService.getProductDescriptions(productId);

    return res.status(200).json({
      descriptions,
    });
  } catch (err) {
    console.log("Get product descriptions failed", err.message);
    return res
      .status(err.status || 500)
      .json({ message: err.message || "Internal server error" });
  }
};

export const search = async (req, res) => {
  try {
    const { keyword } = req.params;
    const { page, limit, minPrice, maxPrice, order, sortBy } = req.query;

    const data = await productService.fullTextSearch(
      keyword,
      Number(minPrice),
      Number(maxPrice),
      sortBy,
      order,
      Number(page),
      Number(limit)
    );
    console.log(data);

    return res.status(200).json({ data, total: data.length });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
