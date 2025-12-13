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
    const { email, token } = req.body;

    if (!email || !token) {
      return res.status(400).json({ message: "Invalid verification link." });
    }

    const result = await authService.verifyEmail({ email, token });
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

export const signOut = async (req, res) => {
  try {
    const result = await authService.signOut();
    return res.status(200).json(result);
  } catch (err) {
    return res.status(err.status || 500).json({
      message: err.message || "Internal server error",
    });
  }
};

export const requestOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message:
          "Some required information is missing. Please review and complete the form.",
      });
    }

    const result = await authService.requestOtp(email);

    return res.status(200).json(result);
  } catch (err) {
    return res.status(err.status || 500).json({
      message: err.message || "Internal server error",
    });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { email, token } = req.body;

    if (!email) {
      return res.status(400).json({
        message:
          "Some required information is missing. Please review and complete the form.",
      });
    }

    const result = await authService.verifyOtp(email, token);

    return res.status(200).json(result);
  } catch (err) {
    return res.status(err.status || 500).json({
      message: err.message || "Internal server error",
    });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { newPassword } = req.body;

    if (!newPassword) {
      return res.status(400).json({
        message: "Some required information is missing.",
      });
    }

    const result = await authService.resetPassword(newPassword);

    return res.status(200).json(result);
  } catch (err) {
    return res
      .status(err.status || 500)
      .json({ message: err.message || "Interal server error" });
  }
};
