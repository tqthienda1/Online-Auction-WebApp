import express from "express";
import { addProduct } from "../controllers/productController.js";
import multer from "multer";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

const mockUser = (req, res, next) => {
  req.user = "07000d2e-90d9-4523-8f68-bddd658b484e"; // hoặc object user
  next();
};

router.post("/", mockUser, upload.array("productImages"), addProduct);
// router.delete("/", deleteProduct);

export default router;
