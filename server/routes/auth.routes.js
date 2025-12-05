import express from "express";
import {
  signUp,
  signIn,
  verifyEmail,
  changePassword,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/signup", signUp);
router.post("/signin", signIn);
router.get("/verify", verifyEmail);
router.patch("/change-password", changePassword);

export default router;
