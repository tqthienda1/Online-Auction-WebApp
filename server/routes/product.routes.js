import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { requireRole } from "../middlewares/requireRole.js";
import {
  addProduct,
  getProducts,
  getProductById,
} from "../controllers/productController.js";
import multer from "multer";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

const mockUser = (req, res, next) => {
  req.user = "a0859fe9-9bf5-4b7b-adf7-8f7a8675780b"; // hoặc object user
  next();
};

// public;
router.get("/", getProducts);
router.get("/:id", getProductById);

// // seller
// router.post("/", authMiddleware, requireRole(["seller"]), addProduct);
// router.put("/:id", authMiddleware, requireRole(["seller"]), updateProduct);
// router.delete("/:id", authMiddleware, requireRole(["seller"]), deleteProduct);

// admin

// router.post("/", mockUser, upload.array("productImages"), addProduct);
// router.delete("/", deleteProduct);

router.post("/", mockUser, upload.array("productImages"), addProduct);
export default router;
