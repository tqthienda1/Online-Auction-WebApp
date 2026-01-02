import express from "express";
import {
  authMiddleware,
  optionalAuthMiddleware,
} from "../middlewares/authMiddleware.js";
import { requireRole } from "../middlewares/requireRole.js";
import {
  addProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getProductBidHistory,
  getProductAuction,
  getProductDescriptions,
  search,
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
router.get("/", optionalAuthMiddleware, getProducts);
router.get("/search/:keyword", search);
router.get("/:id", getProductById);
router.get("/:id/bid-history", getProductBidHistory);
router.get("/:id/auction", getProductAuction);
router.get(":id/descriptions", getProductDescriptions);
// router.get("/search");

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
  authMiddleware,
  requireRole(["SELLER", "ADMIN"]),
  deleteProduct
);

export default router;
