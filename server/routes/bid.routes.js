import express from "express";
import * as BidController from "../controllers/bidController.js";

const router = express.Router();

const mockUser = (req, res, next) => {
  req.user = "1032710c-e82d-45ca-a6bf-702681c6aaab"; // hoặc object user
  next();
};

router.post("/", mockUser, BidController.placeBid);

export default router;
