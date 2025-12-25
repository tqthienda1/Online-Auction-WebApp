import prisma from '../prismaClient.js'
import { sendMessage, getMessages } from '../services/chat.service.js'

export const postMessage = async (req, res) => {
  try {
    const { productID } = req.params;
    const { content, order } = req.body;
    const senderID = req.user?.id || req.user;

    if (!senderID) return res.status(401).json({ message: 'Unauthorized' });


    let receiverID;
    if (senderID === order.buyerID) receiverID = order.sellerID;
    else if (senderID === order.sellerID) receiverID = order.buyerID;
    else return res.status(403).json({ message: 'Not allowed to message for this order' });

    const msg = await sendMessage({ productID, senderID, receiverID, content });
    return res.status(201).json(msg);
  } catch (err) {
    console.error('Post message failed:', err);
    if (err?.status && err?.message) return res.status(err.status).json({ message: err.message });
    return res.status(500).json({ message: err.message || 'Server error' });
  }
};

export const listMessages = async (req, res) => {
  try {
    const { productID } = req.params;
    const msgs = await getMessages(productID);
    return res.json(msgs);
  } catch (err) {
    console.error('Get messages failed:', err);
    return res.status(500).json({ message: err.message || 'Server error' });
  }
};

export default { postMessage, listMessages };
