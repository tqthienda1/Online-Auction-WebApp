import React from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash, FaGoogle } from "react-icons/fa";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import logo from "../../public/image/logo.png";
import { logIn, signInWithGoogle } from "../services/auth.service.js";

const LogInPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState("");

  const schema = z.object({
    identifier: z.string().nonempty("Identifier is required"),
    password: z.string().nonempty("Password is required"),
  });

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });
  const [showPass, setShowPass] = useState(false);

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      setFormError("");

      await logIn({
        email: data.identifier,
        password: data.password,
      });

      navigate("/");
    } catch (err) {
      if (err.message?.includes("Invalid")) {
        setFormError("Email or password is incorrect");
      } else {
        setFormError("Log in failed. Please try again later.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (isLoading) return;

    try {
      setIsLoading(true);

      // await new Promise((r) => setTimeout(r, 1000));
      await signInWithGoogle();
    } catch (err) {
      setFormError("Google log in failed. Please try again later.");
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
          Log in to your account
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label htmlFor="identifier" className="sr-only">
              Email
            </label>
            <input
              type="text"
              name="identifier"
              id="identifier"
              {...register("identifier")}
              placeholder="Email"
              className="w-full border-b border-gray-300 focus:outline-none py-3 placeholder-gray-400"
            />

            <span className="text-red-600 text-sm mt-1 block">
              {errors.identifier ? errors.identifier.message : ""}
            </span>
          </div>

          <div className="password relative">
            <label htmlFor="password" className="sr-only">
              Password
            </label>
            <input
              type={showPass ? "text" : "password"}
              {...register("password")}
              placeholder="Password"
              name="password"
              id="password"
              className="w-full border-b border-gray-300 focus:outline-none py-3 placeholder-gray-400 pr-10"
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
              {errors.password ? errors.password.message : ""}
            </span>
          </div>

          {formError && (
            <div className="text-red-600 text-sm text-center p-3 rounded-md mb-6 ">
              {formError}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 rounded-md transition
                          ${
                            isLoading
                              ? "bg-gray-400 cursor-not-allowed"
                              : "bg-black hover:opacity-60 cursor-pointer text-white"
                          }
                        `}
            >
              {isLoading ? "Logging in..." : "Log In"}
            </button>
          </div>
        </form>

        <div className="mt-4">
          <Link to="#" className="text-sm text-gray-700 underline">
            Forgot password?
          </Link>
        </div>

        <div className="mt-8 space-y-4">
          <button
            disabled={isLoading}
            className={`w-full border border-gray-300 py-3 rounded-md flex items-center justify-center gap-3 
                ${
                  isLoading
                    ? "bg-gray-100 opacity-50 cursor-not-allowed"
                    : "hover:bg-gray-100 cursor-pointer"
                }
            `}
            onClick={handleGoogleSignIn}
          >
            <FaGoogle className="text-red-500" />
            {isLoading ? (
              <span>Logging in with Google...</span>
            ) : (
              <span>Log in with Google</span>
            )}
          </button>
        </div>

        <p className="text-center text-sm text-gray-600 mt-6">
          Don't have an account?{" "}
          <Link to="/signup" className="underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LogInPage;
