import express from 'express'
import * as orderController from '../controllers/orderController.js'
import multer from "multer";
const router = express.Router()
const upload = multer({ storage: multer.memoryStorage() });
// Create order
router.post('/', orderController.createOrder)

// Get order by productID
router.get('/:productID', orderController.getOrder)

router.put(
  '/:productID/buyerInfo',
  upload.single("paymentInvoice"),   
  orderController.updateBuyerInfo
);


router.put('/:productID/shipping', upload.single("shippingInvoice"), orderController.uploadShipping)

// Confirm received by buyer/seller
router.put('/:productID/receivePayment', orderController.confirmPaymentReceived)
router.put('/:productID/receiveProduct', orderController.confirmProductReceived)

// Cancel order
router.delete('/:productID', orderController.cancelOrder)

export default router
