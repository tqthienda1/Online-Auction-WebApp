import express from 'express'
import { postMessage, listMessages } from '../controllers/chatController.js'
import { authMiddleware } from '../middlewares/authMiddleware.js'

const router = express.Router()

// POST /chat/products/:productID/messages
router.post('/products/:productID/messages', authMiddleware, postMessage)

// GET /chat/products/:productID/messages
router.get('/products/:productID/messages', authMiddleware, listMessages)

export default router
