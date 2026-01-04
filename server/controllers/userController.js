import * as UserService from "../services/user.service.js";

export const getUsers = async (req, res) => {
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
};

export const updateUsername = async (req, res) => {
  try {
    const { username, address } = req.body;

    if (!username || !address) {
      return res.status(400).json({ message: "username or address is blank" });
    }

    const updatedUser = await UserService.updateUsername(
      req.user.id,
      username,
      address
    );

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

export const getUserRatings = async (req, res) => {
  try {
    const ratings = await UserService.getUserRatings(req.user.id);
    return res.status(200).json({ data: ratings });
  } catch (error) {
    console.log("Get user ratings failed: ", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getUserComments = async (req, res) => {
  try {
    console.log("Fetching comments for user:", req.user.id);
    const comments = await UserService.getUserComments(req.user.id);
    console.log("Comments found:", comments);
    return res.status(200).json({ data: comments });
  } catch (error) {
    console.log("Get user comments failed: ", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const createUser = async (req, res) => {
  try {
    const { supabaseId, username, role, dob, address } = req.body;
    const user = await UserService.createUser({
      supabaseId,
      username,
      role,
      dob,
      address,
    });
    return res.status(201).json({ data: user });
  } catch (error) {
    console.error("Create user failed:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updateUser = async (req, res) => {
  try {
    const id = req.params.id;
    const payload = req.body;
    const user = await UserService.updateUserById(id, payload);
    return res.status(200).json({ data: user });
  } catch (error) {
    console.error("Update user failed:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const id = req.params.id;
    await UserService.deleteUserById(id);
    return res.status(200).json({ message: "User deleted" });
  } catch (error) {
    console.error("Delete user failed:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const id = req.params.id;
    await UserService.resetPassword(id);
    return res.status(200).json({ message: "Reset password successfully" });
  } catch (error) {
    console.error("Reset password failed:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getInfoById = async (req, res) => {
  try {
    const { id } = req.params;

    const info = await UserService.getInfoById(id);

    if (!info) {
      return res.status(400).json({ message: "User not found" });
    }

    return res.status(200).json(info);
  } catch (error) {
    console.error("Get info by id failed: ", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};
