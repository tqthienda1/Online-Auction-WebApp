import express from "express";

import { authMiddleware } from "../middlewares/authMiddleware.js";
import { requireRole } from "../middlewares/requireRole.js";

import * as UserController from "../controllers/userController.js";

const router = express.Router();

router.patch(
  "/",
  authMiddleware,
  requireRole(["BIDDER"]),
  UserController.updateUsername
);

router.get(
  "/",
  authMiddleware,
  requireRole(["BIDDER", "ADMIN", "SELLER"]),
  UserController.getInfo
);

export default router;
