import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { requireRole } from "../middlewares/requireRole.js";
import {
  addProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";
import multer from "multer";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

const mockUser = (req, res, next) => {
  req.user = req.user || {};
  req.user.id = "1032710c-e82d-45ca-a6bf-702681c6aaab"; // hoặc object user
  next();
};

// public;
router.get("/", getProducts);
router.get("/:id", getProductById);

// seller
router.post(
  "/",
  authMiddleware,
  requireRole(["SELLER"]),
  upload.array("productImages"),
  addProduct
);
router.put("/:id", authMiddleware, requireRole(["SELLER"]), updateProduct);
router.delete(
  "/:id",
  // authMiddleware,
  // requireRole(["SELLER, ADMIN"]),
  deleteProduct
);

// admin
// router.delete("/", deleteProduct);

//router.post("/", mockUser, upload.array("productImages"), addProduct);
export default router;
