import express from "express";
import {
  createComment,
  replyComment,
  updateComment,
  deleteComment,
} from "../controllers/commentController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { requireRole } from "../middlewares/requireRole.js";

const router = express.Router();

router.post(
  "/products/:id",
  authMiddleware,
  requireRole(["BIDDER", "SELLER", "ADMIN"]),
  createComment
);

router.put("/:commentID", updateComment);
router.delete("/:commentID", deleteComment);

router.post("/:commentID/replies", replyComment);


export default router;
