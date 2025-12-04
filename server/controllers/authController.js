import bcrypt from "bcrypt";
import prisma from "../prismaClient.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import dotenv from "dotenv";

import { supabase } from "../libs/client.js";

dotenv.config();

const ACCESS_TOKEN_TTL = "30m";
const REFRESH_TOKEN_TTL = 14 * 24 * 60 * 1000;

export const signUp = async (req, res) => {
  try {
    const { username, password, email, dob, address } = req.body;
    console.log(username, password, email, dob, address);

    if (!username || !password || !email || !dob || !address) {
      return res.status(400).json({
        message:
          "Some required information is missing. Please review and complete the form.",
      });
    }

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      console.error("Supabase auth failed:", authError);
      return res.status(400).json({ error: authError.message });
    }

    const supabaseId = authData.user.id;

    const existingUser = await prisma.user.findUnique({
      where: { supabaseId },
    });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists in local database.",
      });
    }

    await prisma.user.create({
      data: {
        supabaseId,
        username,
        dob,
        address,
        role: "BIDDER",
        ratingPos: 0,
        ratingNeg: 0,
      },
    });

    return res.status(201).json({
      message: "User registered successfully.",
      userId: username,
    });
  } catch (error) {
    console.error("Registration failed", error);
    return res
      .status(500)
      .json({ message: "A system error occurred. Please try again later." });
  }
};

export const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(email, password);

    if (!email || !password) {
      return res.status(400).json({
        message:
          "Some required information is missing. Please review and complete the form.",
      });
    }

    const { data: authData, error: authError } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    console.log(authData, authError);

    if (authError) {
      return res
        .status(401)
        .json({ message: "Email or password is incorrect." });
    }

    const supabaseId = authData.user.id;
    const accessToken = authData.session.access_token;
    const refreshToken = authData.session.refresh_token;

    return res.status(200).json({
      message: "Login successful",
      userId: supabaseId,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.error("Login failed", error);
    return res
      .status(500)
      .json({ message: "A system error occurred. Please try again later." });
  }
};
