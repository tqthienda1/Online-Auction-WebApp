import * as orderService from '../services/order.service.js'
import { uploadFileToSupabase } from "../services/supabase.service.js";
export const createOrder = async (req, res) => {
  try {
    const { productID, sellerID, buyerID} = req.body
    
    if (!productID || !sellerID || !buyerID) {
      return res.status(400).json({ message: 'Missing required fields' })
    }

    const result = await orderService.createOrder({ productID, sellerID, buyerID})
    return res.status(201).json(result)
  } catch (err) {
    return res.status(err.status || 500).json({ message: err.message || 'Internal server error' })
  }
}

export const getOrder = async (req, res) => {
  try {
    const { productID } = req.params
    const order = await orderService.getOrderByProduct(productID)
    if (!order) return res.status(404).json({ message: 'Order not found' })
    return res.status(200).json(order)
  } catch (err) {
    return res.status(err.status || 500).json({ message: err.message || 'Internal server error' })
  }
}

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
    const { productID } = req.params
    const {shippingAddress } = req.body
    const file = req.file;
    const paymentInvoiceUrl = await uploadFileToSupabase(file);
    if (!paymentInvoiceUrl || !shippingAddress) return res.status(400).json({ message: 'updateInfo is required' })
    
    const updated = await orderService.updateBuyerInfo(productID, paymentInvoiceUrl, shippingAddress)
    return res.status(200).json(updated)
  } catch (err) {
    return res.status(err.status || 500).json({ message: err.message || 'Internal server error' })
  }
}

export const uploadShipping = async (req, res) => {
  try {
    const { productID } = req.params  
    const file = req.file;
    const shippingInvoiceUrl = await uploadFileToSupabase(file);
    if (!shippingInvoiceUrl) return res.status(400).json({ message: 'shippingInvoice is required' })
    const updated = await orderService.updateShippingInvoice(productID, shippingInvoiceUrl)
    return res.status(200).json(updated)
  } catch (err) {
    return res.status(err.status || 500).json({ message: err.message || 'Internal server error' })
  }
}

export const confirmPaymentReceived = async (req, res) => {
  try {
    const { productID } = req.params
    const updated = await orderService.confirmPaymentReceived(productID)
    return res.status(200).json(updated)
  } catch (err) {
    return res.status(err.status || 500).json({ message: err.message || 'Internal server error' })
  }
}

export const confirmProductReceived = async (req, res) => {
  try {
    const { productID } = req.params
    const updated = await orderService.confirmProductReceived(productID)
    return res.status(200).json(updated)
  } catch (err) {
    return res.status(err.status || 500).json({ message: err.message || 'Internal server error' })
  }
}

export const cancelOrder = async (req, res) => {
  try {
    const { productID } = req.params
    const deleted = await orderService.cancelOrder(productID)
    return res.status(200).json(deleted)
  } catch (err) {
    return res.status(err.status || 500).json({ message: err.message || 'Internal server error' })
  }
}

export const getWonOrders = async (req, res) => {
  try {
    const userID = "4b7896cf-7206-4c8a-b246-adebedabfcdd"
    //const { userID } = req.query 
    if (!userID) return res.status(400).json({ message: 'userID required' })
    const orders = await orderService.getWonOrdersByUser(userID)
    return res.status(200).json(orders)
  } catch (err) {
    return res.status(err.status || 500).json({ message: err.message || 'Internal server error' })
  }
}
