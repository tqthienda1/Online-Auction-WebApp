import express from "express";
import * as BidController from "../controllers/bidController.js";

const router = express.Router();

const mockUser = (req, res, next) => {
  req.user.id = "07000d2e-90d9-4523-8f68-bddd658b484e"; // hoặc object user
  next();
};

router.post("/", BidController.placeBid);
