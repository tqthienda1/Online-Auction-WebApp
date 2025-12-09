import React from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash, FaGoogle } from "react-icons/fa";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import logo from "../../public/image/logo.png";

const LogInPage = () => {
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

  const onSubmit = (data) => {
    console.log("login data", data);
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

          <div>
            <button
              type="submit"
              className="w-full bg-black text-white py-3 rounded-md hover:opacity-60 cursor-pointer"
            >
              Log In
            </button>
          </div>
        </form>

        <div className="mt-4">
          <Link to="#" className="text-sm text-gray-700 underline">
            Forgot password?
          </Link>
        </div>

        <div className="mt-8 space-y-4">
          <button className="w-full border border-gray-300 py-3 rounded-md flex items-center justify-center gap-3">
            <FaGoogle className="text-red-500" />
            <span>Log in with Google</span>
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
