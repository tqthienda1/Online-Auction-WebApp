import express from "express";
import { addProduct } from "../controllers/productController.js";

const router = express.Router();

router.post("/", addProduct);
router.delete("/", deleteProduct);

export default router;
