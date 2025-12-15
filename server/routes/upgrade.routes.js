import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { requireRole } from "../middlewares/requireRole.js";
import * as upgradeController from "../controllers/upgradeController.js";

const router = express.Router();

// tạo một upgrade request
router.post(
  "/",
  authMiddleware,
  requireRole(["BIDDER"]),
  upgradeController.create
);

// cho user xem lại upgrade request gần nhất của nó xem đã được duyệt chưa
router.get("/me", authMiddleware, upgradeController.getMyRequests);

// cho admin xem tất cả các request hiện có
router.get(
  "/",
  authMiddleware,
  requireRole(["ADMIN"]),
  upgradeController.getAllRequest
);

// dùng để khi admin approve
router.post(
  "/:id/approve",
  authMiddleware,
  requireRole(["ADMIN"]),
  upgradeController.approve
);

router.post(
  "/:id/reject",
  authMiddleware,
  requireRole(["ADMIN"]),
  upgradeController.reject
);

export default router;
