import Router from "express";
import * as UserController from "../controllers/userController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { requireRole } from "../middlewares/requireRole.js";

const router = Router();

router.get("/", UserController.getUsers);

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
