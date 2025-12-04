import express from "express";
import {
  createComment,
  replyComment,
  updateComment,
  deleteComment,
} from "../controllers/commentController.js";

const router = express.Router();

router.post("/products/:productID/", createComment);
router.post("/:commentID/replies", replyComment);
router.put("/:commentID", updateComment);
router.delete("/:commentID", deleteComment);

export default router;
