import * as upgradeService from "../services/upgrade.service.js";

export const create = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await upgradeService.createUpgradeRequest(userId);

    return res.status(201).json(result);
  } catch (err) {
    console.log("Create upgrade request failed", err.message);
    return res
      .status(err.status || 500)
      .json({ message: err.message || "Internal server error" });
  }
};

export const getMyRequests = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await upgradeService.getMyUpgradeRequest(userId);

    return res.status(200).json(result);
  } catch (err) {
    console.log("Get my request failed.", err.message);
    return res
      .status(err.status || 500)
      .json({ message: err.message || "Internal server error" });
  }
};

export const getAllRequest = async (req, res) => {
  try {
    const { status } = req.query;

    const result = await upgradeService.getAllUpgradeRequests(status);

    return res.status(200).json(result);
  } catch (err) {
    console.log("Get all request failed.", err.message);
    return res
      .status(err.status || 500)
      .json({ message: err.message || "Internal server error" });
  }
};

export const approve = async (req, res) => {
  try {
    const requestId = req.params.id;
    const adminId = req.user.id;

    const result = await upgradeService.approveUpgradeRequest({
      requestId,
      adminId,
    });

    return res.status(200).json(result);
  } catch (err) {
    console.log("Approve upgrade request failed.", err.message);
    return res
      .status(err.status || 500)
      .json({ message: err.message || "Internal server error." });
  }
};

export const reject = async (req, res) => {
  try {
    const requestId = req.params.id;
    const adminId = req.user.id;

    const result = await upgradeService.rejectUpgradeRequest({
      requestId,
      adminId,
    });

    return res.status(200).json(result);
  } catch (err) {
    console.log("Reject upgrade request failed.", err.message);
    return res
      .status(err.status || 500)
      .json({ message: err.message || "Internal server error." });
  }
};
