import e from "express";
import { CategoryService } from "../services/category.service.js";
import * as UserService from "../services/user.service.js";
import { join } from "@prisma/client/runtime/library";
// import { ProductService } from "../services/product.service.js";

export const CategoryController = {
  async getAll(req, res) {
    try {
      const data = await CategoryService.getAll();

      if (!data || data.length === 0) {
        return res
          .status(404)
          .json({ success: false, message: "No categories found" });
      }

      return res
        .status(200)
        .json({ data: data, message: "Fetched categories successfully" });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ success: false, message: "Failed to fetch categories" });
    }
  },

  async getById(req, res) {
    try {
      const { id } = req.params;

      const data = await CategoryService.getById(id);
      if (!data)
        return res
          .status(404)
          .json({ success: false, message: "Category not found" });

      return res
        .status(200)
        .json({ data: data, message: "Fetched category successfully" });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ success: false, message: "Failed to fetch category" });
    }
  },

  async create(req, res) {
    try {
      const newCategory = await CategoryService.create(req.body);
      return res
        .status(201)
        .json({ data: newCategory, message: "Category created" });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ success: false, message: "Faile to create category" });
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;

      const exists = await CategoryService.getById(id);
      if (!exists)
        return res
          .status(404)
          .json({ success: false, message: "Category not found" });

      const updated = await CategoryService.update(id, req.body);
      return res
        .status(200)
        .json({ data: updated, message: "Category updated" });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ success: false, message: "Failed to update category" });
    }
  },

  async delete(req, res) {
    try {
      const { id } = req.params;
      await CategoryService.delete(id);

      return res.status(200).json({
        success: true,
        message: "Category deleted",
      });
    } catch (error) {
      if (error.message === "CATEGORY_HAS_CHILDREN") {
        return res.status(400).json({
          success: false,
          code: "CATEGORY_HAS_CHILDREN",
          message: "Category has sub categories",
        });
      }

      if (error.message === "CATEGORY_HAS_PRODUCTS") {
        return res.status(400).json({
          success: false,
          code: "CATEGORY_HAS_PRODUCTS",
          message: "Category has products",
        });
      }

      return res.status(500).json({
        success: false,
        message: "Delete failed",
      });
    }
  },

  async getParentCategories(req, res) {
    try {
      const data = await CategoryService.getParentCategories();

      if (!data || data.length === 0) {
        return res
          .status(404)
          .json({ success: false, message: "No parent categories found" });
      }

      return res
        .status(200)
        .json({ data: data, message: "Fetched parent categories" });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ success: false, message: "Failed to get parent categories" });
    }
  },

  async getChildren(req, res) {
    try {
      const { id } = req.params;

      const data = await CategoryService.getChildrenCategories(id);

      if (!data || data.length === 0) {
        return res
          .status(404)
          .json({ success: false, message: "No child categories found" });
      }

      return res
        .status(200)
        .json({ data: data, message: "Fetched child categories" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch children categories",
      });
    }
  },

  async getTree(req, res) {
    try {
      const data = await CategoryService.getTree();

      if (!data || data.length === 0)
        return res
          .status(404)
          .json({ success: false, message: "No category tree available" });

      return res
        .status(200)
        .json({ data: data, message: "Fetched category tree" });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ success: false, message: "Failed to fetch tree categories" });
    }
  },

  async getCategories(req, res) {
    try {
      const page = parseInt(req.query.page);
      const limit = parseInt(req.query.limit);
      const data = await CategoryService.getCategories(page, limit);
      return res
        .status(200)
        .json({ data: data, message: "Fetched categories successfully" });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ success: false, message: "Failed to fetch categories" });
    }
  },
};
