import { CategoryService } from "../services/category.service.js";
// import { ProductService } from "../services/product.service.js";

export const CategoryController = {
  async getAll(req, res) {
    const data = await CategoryService.getAll();

    if (!data || data.length === 0) {
      return res.status(404).json("No categories found");
    }

    return res.status(200).json(data, "Fetched categories successfully");
  },

  async getById(req, res) {
    const { id } = req.params;

    const data = await CategoryService.getById(id);
    if (!data) return res.status(404).json("Category not found");

    return res.status(200).json(data, "Fetched category successfully");
  },

  async create(req, res) {
    const newCategory = await CategoryService.create(req.body);
    return res.status(201).json("Category created", newCategory);
  },

  async update(req, res) {
    const { id } = req.params;

    const exists = await CategoryService.getById(id);
    if (!exists) return res.status(404).json("Category not found");

    const updated = await CategoryService.update(id, req.body);
    return res.status(200).json(updated, "Category updated");
  },

  async delete(req, res) {
    const { id } = req.params;

    const exists = await CategoryService.getById(id);
    if (!exists) return res.status(404).json("Category not found");

    await CategoryService.delete(id);
    return res.status(200).json(null, "Category deleted");
  },

  async getParentCategories(req, res) {
    const data = await CategoryService.getParentCategories();

    if (!data || data.length === 0) {
      return res.status(404).json("No parent categories found");
    }

    return res.status(200).json(data, "Fetched parent categories");
  },

  async getChildren(req, res) {
    const { id } = req.params;

    const data = await CategoryService.getChildrenCategories(id);

    if (!data || data.length === 0) {
      return res.status(404).json("No child categories found");
    }

    return res.status(200).json(data, "Fetched child categories");
  },

  async getTree(req, res) {
    const data = await CategoryService.getTree();

    if (!data || data.length === 0)
      return res.status(404).json("No category tree available");

    return res.status(200).json(data, "Fetched category tree");
  },
};
