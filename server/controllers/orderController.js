import * as orderService from "../services/order.service.js";
import * as ratingService from "../services/rating.service.js";
import { uploadFileToSupabase } from "../services/supabase.service.js";
export const createOrder = async (req, res) => {
  try {
    const { productID, sellerID, buyerID } = req.body;

    if (!productID || !sellerID || !buyerID) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const result = await orderService.createOrder({
      productID,
      sellerID,
      buyerID,
    });
    return res.status(201).json(result);
  } catch (err) {
    return res
      .status(err.status || 500)
      .json({ message: err.message || "Internal server error" });
  }
};

export const getOrder = async (req, res) => {
  try {
    const { productID } = req.params;
    const order = await orderService.getOrderByProduct(productID);
    if (!order) return res.status(404).json({ message: "Order not found" });
    // Authorization: only the buyer or the seller can fetch this order
    const userID = req.user?.id;
    if (!userID)
      return res.status(401).json({ message: "Authentication required" });
    const isBuyer = order.buyer && String(order.buyer.id) === String(userID);
    const isSeller = order.seller && String(order.seller.id) === String(userID);
    if (!isBuyer && !isSeller)
      return res.status(403).json({ message: "Forbidden" });
    return res.status(200).json(order);
  } catch (err) {
    return res
      .status(err.status || 500)
      .json({ message: err.message || "Internal server error" });
  }
};

// export const listOrders = async (req, res) => {
//   try {
//     const { userID, role } = req.query
//     if (!userID) return res.status(400).json({ message: 'userID required' })
//     const orders = await orderService.listOrdersByUser(userID, role)
//     return res.status(200).json(orders)
//   } catch (err) {
//     return res.status(err.status || 500).json({ message: err.message || 'Internal server error' })
//   }
// }

export const updateBuyerInfo = async (req, res) => {
  try {
    const { productID } = req.params;
    const { shippingAddress } = req.body;
    const file = req.file;

    // ensure order exists and requester is the buyer
    const order = await orderService.getOrderByProduct(productID);
    if (!order) return res.status(404).json({ message: "Order not found" });
    const userID = req.user?.id;
    if (!userID)
      return res.status(401).json({ message: "Authentication required" });
    if (!order.buyer || String(order.buyer.id) !== String(userID)) {
      return res
        .status(403)
        .json({ message: "Only the buyer can update payment info" });
    }

    const paymentInvoiceUrl = await uploadFileToSupabase(file);
    if (!paymentInvoiceUrl || !shippingAddress)
      return res.status(400).json({ message: "updateInfo is required" });

    const updated = await orderService.updateBuyerInfo(
      productID,
      paymentInvoiceUrl,
      shippingAddress
    );
    return res.status(200).json(updated);
  } catch (err) {
    return res
      .status(err.status || 500)
      .json({ message: err.message || "Internal server error" });
  }
};

export const uploadShipping = async (req, res) => {
  try {
    const { productID } = req.params;
    const file = req.file;

    // ensure order exists and requester is the seller
    const order = await orderService.getOrderByProduct(productID);
    if (!order) return res.status(404).json({ message: "Order not found" });
    const userID = req.user?.id;
    if (!userID)
      return res.status(401).json({ message: "Authentication required" });
    if (!order.seller || String(order.seller.id) !== String(userID)) {
      return res
        .status(403)
        .json({ message: "Only the seller can upload shipping invoice" });
    }

    const shippingInvoiceUrl = await uploadFileToSupabase(file);
    if (!shippingInvoiceUrl)
      return res.status(400).json({ message: "shippingInvoice is required" });
    const updated = await orderService.updateShippingInvoice(
      productID,
      shippingInvoiceUrl
    );
    return res.status(200).json(updated);
  } catch (err) {
    return res
      .status(err.status || 500)
      .json({ message: err.message || "Internal server error" });
  }
};

export const confirmPaymentReceived = async (req, res) => {
  try {
    const { productID } = req.params;

    // only seller can confirm payment received
    const order = await orderService.getOrderByProduct(productID);
    if (!order) return res.status(404).json({ message: "Order not found" });
    const userID = req.user?.id;
    if (!userID)
      return res.status(401).json({ message: "Authentication required" });
    if (!order.seller || String(order.seller.id) !== String(userID)) {
      return res
        .status(403)
        .json({ message: "Only the seller can confirm payment received" });
    }

    const updated = await orderService.confirmPaymentReceived(productID);
    return res.status(200).json(updated);
  } catch (err) {
    return res
      .status(err.status || 500)
      .json({ message: err.message || "Internal server error" });
  }
};

export const confirmProductReceived = async (req, res) => {
  try {
    const { productID } = req.params;

    // only buyer can confirm product received
    const order = await orderService.getOrderByProduct(productID);
    if (!order) return res.status(404).json({ message: "Order not found" });
    const userID = req.user?.id;
    if (!userID)
      return res.status(401).json({ message: "Authentication required" });
    if (!order.buyer || String(order.buyer.id) !== String(userID)) {
      return res
        .status(403)
        .json({ message: "Only the buyer can confirm product received" });
    }

    const updated = await orderService.confirmProductReceived(productID);
    return res.status(200).json(updated);
  } catch (err) {
    return res
      .status(err.status || 500)
      .json({ message: err.message || "Internal server error" });
  }
};

export const cancelOrder = async (req, res) => {
  try {
    const { productID } = req.params;

    // only seller can cancel the order
    const order = await orderService.getOrderByProduct(productID);
    if (!order) return res.status(404).json({ message: "Order not found" });
    const userID = req.user?.id;
    if (!userID)
      return res.status(401).json({ message: "Authentication required" });
    if (!order.seller || String(order.seller.id) !== String(userID)) {
      return res
        .status(403)
        .json({ message: "Only the seller can cancel the order" });
    }

    const deleted = await orderService.cancelOrder(productID);
    // After successful cancel by seller, automatically submit a -1 rating for the buyer
    try {
      const raterID = req.user?.id;
      const rateeID = order.buyer?.id;
      if (rateeID && raterID) {
        await ratingService.submitRating({
          raterID,
          rateeID,
          productID,
          value: -1,
          comment: "Người thắng không thanh toán",
        });
      }
    } catch (ratingErr) {
      console.error("Failed to auto-submit rating on cancel:", ratingErr);
      // don't block cancel response on rating failure
    }

    return res.status(200).json(deleted);
  } catch (err) {
    return res
      .status(err.status || 500)
      .json({ message: err.message || "Internal server error" });
  }
};

export const getWonOrders = async (req, res) => {
  try {
    const userID = req.user.id;
    if (!userID) return res.status(400).json({ message: "userID required" });
    const orders = await orderService.getWonOrdersByUser(userID);
    return res.status(200).json(orders);
  } catch (err) {
    return res
      .status(err.status || 500)
      .json({ message: err.message || "Internal server error" });
  }
};

export const createBuyNow = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    const order = await orderService.createBuyNow({
      productId,
      buyerId: userId,
    });

    return res.status(201).json({ order });
  } catch (err) {
    console.log("Failed in create buy now order: ", err.message);
    return res
      .status(err.status || 500)
      .json({ message: err.message || "Internal server error" });
  }
};
