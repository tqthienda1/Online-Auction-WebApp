import express from "express";
import {
  signUp,
  signIn,
  verifyEmail,
  changePassword,
  signOut,
  requestOtp,
  verifyOtp,
  resetPassword,
  signInWithGoogle,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/signup", signUp);
router.post("/signin", signIn);
router.post("/signin-google", signInWithGoogle);
router.post("/verify", verifyEmail);
router.patch("/change-password", changePassword);
router.post("/signout", signOut);
router.post("/request-otp", requestOtp);
router.post("/verify-recovery-otp", verifyOtp);
router.post("/reset-password", resetPassword);

export default router;
