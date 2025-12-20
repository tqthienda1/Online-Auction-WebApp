import { UserService } from "../services/user.service.js";

export const UserController = {
  async getUsers(req, res) {
    try {
      const page = parseInt(req.query.page);
      const limit = parseInt(req.query.limit);
      const data = await UserService.getUsers({ page, limit });
      return res
        .status(200)
        .json({ data: data, message: "Fetched users successfully" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch users",
      });
    }
  },
};
