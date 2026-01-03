import express from "express";
import * as orderController from "../controllers/orderController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { requireRole } from "../middlewares/requireRole.js";
import multer from "multer";
const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });
// Create order
router.post("/", authMiddleware, orderController.createOrder);

// Get order by productID
// Get order by productID (only buyer or seller can access)
router.get("/:productID", authMiddleware, orderController.getOrder);

router.put(
  "/:productID/buyerInfo",
  authMiddleware,
  upload.single("paymentInvoice"),
  orderController.updateBuyerInfo
);

router.put(
  "/:productID/shipping",
  authMiddleware,
  upload.single("shippingInvoice"),
  orderController.uploadShipping
);

// Confirm received by buyer/seller
router.put(
  "/:productID/receivePayment",
  authMiddleware,
  orderController.confirmPaymentReceived
);
router.put(
  "/:productID/receiveProduct",
  authMiddleware,
  orderController.confirmProductReceived
);

// Cancel order
router.delete("/:productID", authMiddleware, orderController.cancelOrder);

//get won orders
router.get(
  "/won/orders",
  authMiddleware,
  requireRole(["BIDDER", "SELLER"]),
  orderController.getWonOrders
);

router.post(
  "/buy-now",
  authMiddleware,
  requireRole(["BIDDER", "SELLER"]),
  orderController.createBuyNow
);
export default router;
