import prisma from "../prismaClient.js";
import { AdminService } from "../services/admin.service.js";

export const AdminController = {
  async getTotalUsers(req, res) {
    try {
      const totalUsers = await AdminService.getUsersCount();

      return res.status(200).json({
        data: totalUsers,
        message: "Fetched total categories successfully",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Failed to fetch total users",
      });
    }
  },

  async getTotalCategories(req, res) {
    try {
      const totalCategories = await AdminService.getCategoriesCount();
      return res.status(200).json({
        data: totalCategories,
        message: "Fetched total categories successfully",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Failed to fetch total categories",
      });
    }
  },

  async getTotalProducts(req, res) {
    try {
      const totalProducts = await AdminService.getProductsCount();
      return res.status(200).json({
        data: totalProducts,
        message: "Fetched total products successfully",
      });
    } catch (error) {
      return res
        .status(500)
        .json({ success: false, message: "Failed to fetch total products" });
    }
  },

  async getTotalRequests(req, res) {
    try {
      const totalRequests = await AdminService.getRequestsCount();
      return res.status(200).json({
        data: totalRequests,
        message: "Fetched total requests successfully",
      });
    } catch (error) {
      return res
        .status(500)
        .json({ success: false, message: "Failed to fetch total requests" });
    }
  },
};
