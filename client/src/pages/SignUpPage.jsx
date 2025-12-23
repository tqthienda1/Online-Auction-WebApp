import React, { useState } from "react";
import { useForm } from "react-hook-form";
import ReCAPTCHA from "react-google-recaptcha";
import { Link, useNavigate } from "react-router-dom";
import { FaGoogle, FaEye, FaEyeSlash } from "react-icons/fa";
import { set, z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import logo from "../../public/image/logo.png";
import { signInWithGoogle, signUp } from "../services/auth.service.js";

const schema = z
  .object({
    username: z.string().nonempty("Username is required"),
    password: z.string().nonempty("Password is required"),
    confirmPassword: z.string().nonempty("Please confirm your password"),
    address: z.string().nonempty("Address is required"),
    dob: z.string().nonempty("Date of birth is required"),
    email: z
      .string()
      .nonempty("Email is required")
      .email("Email format is not valid"),
  })
  .refine((data) => data.confirmPassword === data.password, {
    message: "Password do not match",
    path: ["confirmPassword"],
  });

const SignUpPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    mode: "onBlur",
  });

  const navigate = useNavigate();

  const password = watch("password");
  const confirmPassword = watch("confirmPassword");

  const passwordMismatch = confirmPassword && password !== confirmPassword;
  const passLengthMismatch = password && password.length < 6;

  const [showPass, setShowPass] = useState(false);

  const [recaptchaToken, setRecaptchaToken] = useState(null);

  const onSubmit = async (data) => {
    if (!recaptchaToken) {
      setFormError("Please verify that you are not a robot");
      return;
    }

    try {
      setIsLoading(true);
      setFormError("");

      await signUp(data);

      // alert("Please check your email to verify your account.");
      navigate(`/verify-email?email=${data.email}`);
    } catch (err) {
      if (err.message?.includes("email")) {
        setFormError("Email is already used");
      } else {
        setFormError("Sign up failed. Please try again later");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (isLoading) return;

    try {
      setIsLoading(true);
      await signInWithGoogle();
    } catch (err) {
      setFormError("Google sign up failed. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-6 pb-6">
      <div className="max-w-xl w-full">
        <div className="flex justify-center h-20">
          <img
            onClick={() => navigate("/")}
            src={logo}
            className="object-contain h-full cursor-pointer"
          />
        </div>

        <hr className="my-8 border-gray-200" />

        <h2 className="text-center font-playfair text-3xl font-semibold text-gray-800 mb-8">
          Sign up
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label htmlFor="username" className="sr-only">
              Username
            </label>
            <input
              type="text"
              {...register("username")}
              placeholder="Username"
              id="username"
              className="w-full border-b border-gray-300 focus:outline-none py-3 placeholder-gray-400"
            />
            <span className="text-red-600 text-sm mt-1 block">
              {errors.username ? errors.username.message : ""}
            </span>
          </div>

          <div className="relative">
            <label htmlFor="password" className="sr-only">
              Password
            </label>
            <input
              type={showPass ? "text" : "password"}
              id="password"
              {...register("password")}
              placeholder="Password"
              className="w-full border-b border-gray-300 focus:outline-none py-3 placeholder-gray-400"
            />
            <button
              type="button"
              onClick={() => setShowPass((s) => !s)}
              className="absolute right-0 top-1/2 -translate-y-1/2 mr-2 text-gray-500 cursor-pointer"
              aria-label={showPass ? "Hide password" : "Show password"}
            >
              {showPass ? <FaEye /> : <FaEyeSlash />}
            </button>
            <span className="text-red-600 text-sm mt-1 block">
              {errors.password ? (
                <span>{errors.password.message}</span>
              ) : (
                passLengthMismatch && (
                  <span>Password must be at least 6 characters long</span>
                )
              )}
            </span>
          </div>

          <div className="relative">
            <label htmlFor="confirmPassword" className="sr-only">
              Confirm password
            </label>
            <input
              type={showPass ? "text" : "password"}
              id="confirmPassword"
              {...register("confirmPassword")}
              placeholder="Confirm password"
              className="w-full border-b border-gray-300 focus:outline-none py-3 placeholder-gray-400"
            />
            <button
              type="button"
              onClick={() => setShowPass((s) => !s)}
              className="absolute right-0 top-1/2 -translate-y-1/2 mr-2 text-gray-500 cursor-pointer"
              aria-label={showPass ? "Hide password" : "Show password"}
            >
              {showPass ? <FaEye /> : <FaEyeSlash />}
            </button>
            <span className="text-red-600 text-sm mt-1 block">
              {errors.confirmPassword ? (
                <span>{errors.confirmPassword.message}</span>
              ) : (
                passwordMismatch && <span>Passwords do not match</span>
              )}
            </span>
          </div>

          <div>
            <label htmlFor="email" className="sr-only">
              Email
            </label>
            <input
              type="text"
              id="email"
              {...register("email")}
              placeholder="Email"
              className="w-full border-b border-gray-300 focus:outline-none py-3 placeholder-gray-400"
            />
            <span className="text-red-600 text-sm mt-1 block">
              {errors.email ? errors.email.message : ""}
            </span>
          </div>

          <div>
            <label htmlFor="dob" className="sr-only">
              Date of birth
            </label>
            <input
              type="date"
              id="dob"
              {...register("dob")}
              className="w-full border-b border-gray-300 focus:outline-none py-3 placeholder-gray-400"
            />
            <span className="text-red-600 text-sm mt-1 block">
              {errors.dob ? errors.dob.message : ""}
            </span>
          </div>

          <div>
            <label htmlFor="address" className="sr-only">
              Address
            </label>
            <input
              type="text"
              id="address"
              {...register("address")}
              placeholder="Address"
              className="w-full border-b border-gray-300 focus:outline-none py-3 placeholder-gray-400"
            />
            <span className="text-red-600 text-sm mt-1 block">
              {errors.address ? errors.address.message : ""}
            </span>
          </div>

          <div className="my-4 flex justify-center">
            <ReCAPTCHA
              sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
              onChange={(token) => setRecaptchaToken(token)}
              onExpired={() => setRecaptchaToken(null)}
            />
          </div>

          {formError && (
            <div className="text-red-600 text-sm text-center p-3 rounded-md mb-6">
              {formError}
            </div>
          )}
          <div>
            <button
              disabled={isLoading}
              className={`w-full bg-black text-white py-3 rounded-md transition 
                ${
                  isLoading || !recaptchaToken
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:opacity-60 cursor-pointer"
                }`}
            >
              {isLoading ? "Signing up..." : "Sign up"}
            </button>
          </div>
        </form>
        <div className="mt-8 space-y-4">
          <button
            disabled={isLoading}
            className="w-full border border-gray-300 py-3 rounded-md flex items-center justify-center gap-3 cursor-pointer"
            onClick={handleGoogleSignIn}
          >
            <FaGoogle className="text-red-500" />
            <span>Sign up with Google</span>
          </button>
        </div>

        <p className="text-center text-sm text-gray-600 mt-6">
          Already have an account?{" "}
          <Link to="/login" className="underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUpPage;
