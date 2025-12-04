import express from "express";
import { addProduct } from "../controllers/productController.js";
import multer from "multer";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

const mockUser = (req, res, next) => {
  req.user = "d633e2da-7286-4be7-a870-e12d9f5519ef"; // hoặc object user
  next();
};

router.post("/", mockUser, upload.array("productImages"), addProduct);
// router.delete("/", deleteProduct);

export default router;
