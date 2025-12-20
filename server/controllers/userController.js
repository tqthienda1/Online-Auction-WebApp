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
import * as UserService from "../services/user.service.js";

export const updateUsername = async (req, res) => {
  try {
    const { username, address } = req.body;

    if (!username || !address) {
      return res.status(400).json({ message: "username or address is blank" });
    }

    const updatedUser = await UserService.updateUsername(req.user.id, username, address);

    return res.status(200).json({ updatedUser });
  } catch (error) {
    console.log("Update username failed: ", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getInfo = async (req, res) => {
  try {
    const user = await UserService.getInfo(req.user.id);

    return res.status(200).json(user);
  } catch (error) {
    console.log("Get user info failed: ", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};
