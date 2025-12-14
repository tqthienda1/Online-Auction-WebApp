import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import logo from "../../public/image/logo.png";
import { verifyEmailOTP, resendOtp } from "../services/auth.service.js";

const schema = z.object({
  otp: z.string().nonempty("OTP is required").length(8, "OTP must be 8 digits"),
});

const VerifyEmailPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = new URLSearchParams(location.search).get("email");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    mode: "onBlur",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const onSubmit = async (data) => {
    if (!email) {
      alert("Missing email for verification");
      return;
    }

    try {
      setIsSubmitting(true);
      await verifyEmailOTP({
        email,
        token: data.otp,
      });

      alert("Email verified successfully!");
      navigate("/login");
    } catch (err) {
      alert(err.message || "Invalid or expired OTP");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (!email) return;

    try {
      setIsResending(true);
      await resendOtp({ email });
      alert("OTP has been resent. Please check your email.");
    } catch (err) {
      alert(err.message || "Failed to resend OTP");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-6 pb-6">
      <div className="max-w-xl w-full">
        {/* Logo */}
        <div className="flex justify-center h-20">
          <img
            src={logo}
            onClick={() => navigate("/")}
            className="object-contain h-full cursor-pointer"
            alt="logo"
          />
        </div>

        <hr className="my-8 border-gray-200" />

        {/* Title */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">
            Verify your email
          </h2>
          <p className="text-sm text-gray-600 mt-2">
            We sent a 8-digit code to <br />
            <span className="font-medium">{email}</span>
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label htmlFor="otp" className="sr-only">
              OTP
            </label>
            <input
              type="text"
              inputMode="numeric"
              maxLength={8}
              id="otp"
              {...register("otp")}
              placeholder="Enter 8-digit OTP"
              className="w-full border-b border-gray-300 focus:outline-none py-3 text-center tracking-widest text-lg placeholder-gray-400"
            />
            <span className="text-red-600 text-sm mt-1 block text-center">
              {errors.otp ? errors.otp.message : ""}
            </span>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-black text-white py-3 rounded-md hover:opacity-60 disabled:opacity-50 cursor-pointer"
          >
            {isSubmitting ? "Verifying..." : "Verify email"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={handleResend}
            disabled={isResending}
            className="text-sm underline text-gray-700 hover:text-black disabled:opacity-50"
          >
            {isResending ? "Resending..." : "Resend OTP"}
          </button>
        </div>

        <p className="text-center text-sm text-gray-600 mt-6">
          Back to{" "}
          <Link to="/login" className="underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
