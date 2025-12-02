import bcrypt from "bcrypt";
import prisma from "../prismaClient.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const ACCESS_TOKEN_TTL = "30m";
const REFRESH_TOKEN_TTL = 14 * 24 * 60 * 1000; // 14 NGAY

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

    const duplicate = await prisma.user.findUnique({
      where: { email },
    });

    if (duplicate) {
      return res.status(409).json({
        message:
          "This email address is already associated with an existing account.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        email,
        dob,
        address,
        role: "BIDDER",
        ratingPos: 0,
        ratingNeg: 0,
      },
    });
    return res.sendStatus(204);
  } catch (error) {
    console.error("Registration failed", error);
    return res
      .status(500)
      .json({ message: "A system error occurred. Please try again later." });
  }
};

export const signin = async (req, res) => {
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

    const passwordCorrect = await bcrypt.compare(password, user.hashedPassword);

    if (!passwordCorrect) {
      return res
        .status(401)
        .json({ message: "Email or password is incorrect." });
    }

    // tao access token bang jwt
    const accessToken = jwt.sign(
      { userId: user.id },
      process.env.ACCESS_TOKEN_SERECT,
      { expiresIn: ACCESS_TOKEN_TTL }
    );

    // tao refresh token
    const refreshToken = crypto.randomBytes(64).toString("hex");
  } catch (error) {
    console.error("Login failed", error);
    return res
      .status(500)
      .json({ message: "A system error occurred. Please try again later." });
  }
};
