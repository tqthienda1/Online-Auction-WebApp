import express from "express";
import {
  getAllComment,
  createComment,
  updateComment,
  deleteComment,
} from "../controllers/commentController.js";

const router = express.Router();

router.post("/", getAllComment);
router.post("/create", createComment);
router.post("/update", updateComment);
router.post("/delete", deleteComment);

export default router;
