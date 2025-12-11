import prisma from "../prismaClient.js";

export const requireRole = (allowedRoles = []) => {
  return async (req, res, next) => {
    try {
      const role = req.user.role;

      if (!allowedRoles.includes(role)) {
        return res.status(403).json({ message: "Forbidden. Role not allowed" });
      }

      next();
    } catch (err) {
      console.error("Require role middleware error: ", err);
      return res.status(500).json({ message: "Internal server error" });
    }
  };
};
