import * as authService from "../services/auth.service.js";

export const signUp = async (req, res) => {
  try {
    const { email, password, username, dob, address } = req.body;

    if (!email || !password || !username || !dob || !address) {
      return res.status(400).json({
        message:
          "Some required information is missing. Please review and complete the form.",
      });
    }

    const result = await authService.signUp({
      email,
      password,
      username,
      dob,
      address,
    });
    return res.status(201).json(result);
  } catch (err) {
    return res.status(err.status || 500).json({
      message: err.message || "Internal server error",
    });
  }
};

export const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message:
          "Some required information is missing. Please review and complete the form.",
      });
    }
    const result = await authService.signIn({ email, password });
    return res.status(200).json(result);
  } catch (err) {
    return res.status(err.status || 500).json({
      message: err.message || "Internal server error",
    });
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const { token_hash, type } = req.query;

    if (!token_hash || type !== "signup") {
      return res.status(400).json({ message: "Invalid verification link." });
    }

    const result = await authService.verifyEmail({ token_hash, type });
    return res.status(200).json(result);
  } catch (err) {
    return res.status(err.status || 500).json({
      message: err.message || "Internal server error",
    });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { email, oldPassword, newPassword } = req.body;

    if (!email || !oldPassword || !newPassword) {
      return res.status(400).json({
        message:
          "Some required information is missing. Please review and complete the form.",
      });
    }

    const result = await authService.changePassword({
      email,
      oldPassword,
      newPassword,
    });

    return res.status(200).json(result);
  } catch (err) {
    return res.status(err.status || 500).json({
      message: err.message || "Internal server error",
    });
  }
};
