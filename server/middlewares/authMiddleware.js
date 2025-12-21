import { supabase } from "../libs/client.js";
import prisma from "../prismaClient.js";

export const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Missing or invalid token" });
    }

    const token = authHeader.split(" ")[1];

    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data.user) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    const supabaseUser = data.user;

    let dbUser = await prisma.user.findUnique({
      where: { supabaseId: supabaseUser.id },
    });

    if (!dbUser) {
      dbUser = await prisma.user.create({
        data: {
          supabaseId: supabaseUser.id,
          username: supabaseUser.email,
          role: "BIDDER",
          ratingPos: 0,
          ratingNeg: 0,
          emailVerified: true,
        },
      });
    }
    req.user = {
      supabase: supabaseUser,
      db: dbUser,
      id: dbUser.id,
      supabaseId: supabaseUser.id,
      role: dbUser.role,
      email: supabaseUser.email,
    };
    next();
  } catch (err) {
    console.error("Auth middleware error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};
