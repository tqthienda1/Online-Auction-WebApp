import express from "express";
import {
  createComment,
  replyComment,
  updateComment,
  deleteComment,
} from "../controllers/commentController.js";

const router = express.Router();

const mockUser = (req, res, next) => {
  req.user = "07000d2e-90d9-4523-8f68-bddd658b484e";
  next();
};

router.post("/products/:productID/", mockUser, createComment);
router.put("/:commentID", updateComment);
router.delete("/:commentID", deleteComment);

router.post("/:commentID/replies", mockUser, replyComment);

export default router;
