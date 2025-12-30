import express from "express";

import { authMiddleware } from "../middlewares/authMiddleware.js";
import { requireRole } from "../middlewares/requireRole.js";

import * as UserController from "../controllers/userController.js";

const router = express.Router();

router.get("/", UserController.getUsers);

router.get(
  "/me/ratings",
  authMiddleware,
  requireRole(["BIDDER", "ADMIN", "SELLER"]),
  UserController.getUserRatings
);

router.get(
  "/me/comments",
  authMiddleware,
  requireRole(["BIDDER", "ADMIN", "SELLER"]),
  UserController.getUserComments
);

router.get(
  "/me",
  authMiddleware,
  requireRole(["BIDDER", "ADMIN", "SELLER"]),
  UserController.getInfo
);

router.patch(
  "/",
  authMiddleware,
  requireRole(["BIDDER"]),
  UserController.updateUsername
);

export default router;
