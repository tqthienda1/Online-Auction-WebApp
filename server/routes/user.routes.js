import express from "express";

import { authMiddleware } from "../middlewares/authMiddleware.js";
import { requireRole } from "../middlewares/requireRole.js";

import * as UserController from "../controllers/userController.js";

const router = express.Router();

router.get("/", UserController.getUsers);

// Admin CRUD for users
router.post(
  "/",
  authMiddleware,
  requireRole(["ADMIN"]),
  UserController.createUser
);

router.put(
  "/:id",
  authMiddleware,
  requireRole(["ADMIN"]),
  UserController.updateUser
);

router.delete(
  "/:id",
  authMiddleware,
  requireRole(["ADMIN"]),
  UserController.deleteUser
);

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

router.get(
  "/:id",
  authMiddleware,
  requireRole(["BIDDER", "ADMIN", "SELLER"]),
  UserController.getInfoById
);

router.patch(
  "/",
  authMiddleware,
  requireRole(["BIDDER"]),
  UserController.updateUsername
);

router.patch(
  "/reset-password/:id",
  authMiddleware,
  requireRole(["ADMIN"]),
  UserController.resetPassword
);

export default router;
