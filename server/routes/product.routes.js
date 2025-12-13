import express from "express";
import { addProduct } from "../controllers/productController.js";
import multer from "multer";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

const mockUser = (req, res, next) => {
  req.user = "a0859fe9-9bf5-4b7b-adf7-8f7a8675780b"; // hoặc object user
  next();
};

router.post("/", mockUser, upload.array("productImages"), addProduct);
// router.delete("/", deleteProduct);

export default router;
