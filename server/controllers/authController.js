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
        dob: new Date(dob),
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
    // Lấy thông tin
    const { email, password } = req.body;

    // Validate thông tin
    if (!email || !password) {
      return res.status(400).json({
        message:
          "Some required information is missing. Please review and complete the form.",
      });
    }

    // So hashedPassword với password coi có đúng k
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res
        .status(401)
        .json({ message: "Email or password is incorrect." });
    }

    const passwordCorrect = await bcrypt.compare(password, user.password);

    if (!passwordCorrect) {
      return res
        .status(401)
        .json({ message: "Email or password is incorrect." });
    }

    // tao access token bang jwt
    const accessToken = jwt.sign(
      { userId: user.id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: ACCESS_TOKEN_TTL }
    );

    // tao refresh token
    const refreshToken = crypto.randomBytes(64).toString("hex");
    const tokenHash = await bcrypt.hash(refreshToken, 10);
    const expiresAt = new Date(Date.now() + REFRESH_TOKEN_TTL);

    await prisma.session.create({
      data: {
        userID: user.id,
        tokenHash,
        expiresAt,
      },
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: REFRESH_TOKEN_TTL,
    });

    return res
      .status(200)
      .json({ message: `User ${user.username} has logged in.` }, accessToken);
  } catch (error) {
    console.error("Login failed", error);
    return res
      .status(500)
      .json({ message: "A system error occurred. Please try again later." });
  }
};
