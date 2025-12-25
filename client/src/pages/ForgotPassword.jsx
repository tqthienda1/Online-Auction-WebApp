import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaEye, FaEyeSlash, FaGoogle } from "react-icons/fa";
import logo from "../../public/image/logo.png";
import Stepper from "../components/Stepper.jsx";
import * as AuthService from "../services/auth.service.js";

const ForgotPasswordOTPPage = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSendOTP = async () => {
    if (!email) {
      setError("Email is required");
      return;
    }

    try {
      setError("");
      setIsLoading(true);

      await AuthService.requestOtp(email);

      setStep(2);
    } catch (err) {
      setError("Send OTP failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (otp.length !== 8) {
      setError("OTP must be 8 digits");
      return;
    }

    try {
      setError("");
      setIsLoading(true);

      await AuthService.verifyOtp(email, otp);

      setStep(3);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!password || password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setError("");
      setIsLoading(true);

      await AuthService.resetPassword(password);

      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-6 pb-6">
      <div className="max-w-xl w-full">
        <div className="flex justify-center h-20">
          <img
            src={logo}
            onClick={() => navigate("/")}
            className="object-contain h-full cursor-pointer"
            alt="logo"
          />
        </div>

        <hr className="my-8 border-gray-200" />

        <div className="">
          <Stepper step={step} />
        </div>

        {step === 1 && (
          <>
            <div className="text-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">
                Forgot password
              </h2>
              <p className="text-sm text-gray-600 mt-2">
                Enter your email to receive an OTP.
              </p>
            </div>

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border-b border-gray-300 py-3 text-center focus:outline-none"
            />

            {error && (
              <p className="text-red-600 text-sm text-center mt-2">{error}</p>
            )}

            <button
              onClick={handleSendOTP}
              disabled={isLoading}
              className="w-full bg-black text-white py-3 rounded-md mt-6 hover:opacity-60 disabled:opacity-50"
            >
              {isLoading ? "Sending OTP..." : "Send OTP"}
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <div className="text-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">
                Verify OTP
              </h2>
              <p className="text-sm text-gray-600 mt-2">
                Enter the OTP sent to <br />
                <span className="font-medium">{email}</span>
              </p>
            </div>

            <input
              type="text"
              inputMode="numeric"
              maxLength={8}
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter 8-digit OTP"
              className="w-full border-b border-gray-300 py-3 text-center tracking-widest text-lg focus:outline-none"
            />

            {error && (
              <p className="text-red-600 text-sm text-center mt-2">{error}</p>
            )}

            <button
              onClick={handleVerifyOTP}
              disabled={isLoading}
              className="w-full bg-black text-white py-3 rounded-md mt-6 hover:opacity-60 disabled:opacity-50"
            >
              {isLoading ? "Verifying..." : "Verify OTP"}
            </button>
          </>
        )}

        {step === 3 && (
          <>
            <div className="text-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">
                Reset password
              </h2>
              <p className="text-sm text-gray-600 mt-2">
                Enter your new password.
              </p>
            </div>

            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                id="password"
                placeholder="New password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border-b border-gray-300 py-3 focus:outline-none mb-4"
              />
              <button
                type="button"
                onClick={() => setShowPass((s) => !s)}
                className="absolute right-0 top-1/2 -translate-y-1/2 mr-2 text-gray-500 cursor-pointer"
                aria-label={showPass ? "Hide password" : "Show password"}
              >
                {showPass ? <FaEye /> : <FaEyeSlash />}
              </button>
            </div>

            <div className="relative">
              <input
                type={showConfirmPass ? "text" : "password"}
                id="confirmPassword"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full border-b border-gray-300 py-3 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPass((s) => !s)}
                className="absolute right-0 top-1/2 -translate-y-1/2 mr-2 text-gray-500 cursor-pointer"
                aria-label={showConfirmPass ? "Hide password" : "Show password"}
              >
                {showConfirmPass ? <FaEye /> : <FaEyeSlash />}
              </button>
            </div>

            {error && (
              <p className="text-red-600 text-sm text-center mt-2">{error}</p>
            )}

            <button
              onClick={handleResetPassword}
              disabled={isLoading}
              className="w-full bg-black text-white py-3 rounded-md mt-6 hover:opacity-60 disabled:opacity-50"
            >
              {isLoading ? "Resetting..." : "Reset password"}
            </button>
          </>
        )}

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

export default ForgotPasswordOTPPage;
