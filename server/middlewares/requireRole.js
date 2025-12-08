import { Prisma } from "@prisma/client";

export const requireRole = (allowedRoles = []) => {
  return async (req, res, next) => {
    try {
      const userId = req.user.id;

      const user = await Prisma.findUnique({ where: { id: userId } });

      if (!user) {
        return res.status(401).json({ message: "Invalid or expired token" });
      }

      if (!allowedRoles.includes(user.role)) {
        return res.json(403).json({ message: "Forbidden. Role not allowed" });
      }

      req.user.role = user.role;

      next();
    } catch (err) {
      console.error("Require role middleware error: ", err);
      return res.status(500).json({ message: "Internal server error" });
    }
  };
};
