import express from "express";
import {
  createComment,
  replyComment,
  updateComment,
  deleteComment,
} from "../controllers/commentController.js";

const router = express.Router();

const mockUser = (req, res, next) => {
  req.user = "a0859fe9-9bf5-4b7b-adf7-8f7a8675780b";
  next();
};

router.post("/products/:productID/", mockUser, createComment);
router.put("/:commentID", updateComment);
router.delete("/:commentID", deleteComment);

router.post("/:commentID/replies", mockUser, replyComment);

export default router;
