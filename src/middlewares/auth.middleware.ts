import { Request, Response, NextFunction } from "express";
import { TokenExpiredError, JsonWebTokenError } from "jsonwebtoken";
import { prisma } from "@/config/prisma";
import { verifyJwt } from "@/utils/jwt";

/**
 * Authentication required. Read the token from the "Authorization: Bearer <token>" header.
 * If valid, populate req.user for the next controller.
 */
export async function authenticate(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Not logged in" });
    }

    const token = authHeader.split(" ")[1];
    const payload = verifyJwt(token);

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, role: true, defaultPersona: true, isActive: true },
    });

    if (!user || !user.isActive) {
      return res.status(401).json({ message: "User not found or inactive" });
    }

    req.user = {
      id: user.id,
      role: user.role,
      defaultPersona: user.defaultPersona,
    };
    next();
  } catch (err) {
    if (err instanceof TokenExpiredError) {
      return res
        .status(401)
        .json({ message: "Session expired, please log in again" });
    }
    if (err instanceof JsonWebTokenError) {
      return res.status(401).json({ message: "Invalid token" });
    }
    return res.status(401).json({ message: "Authentication failed" });
  }
}

/**
 * Requires admin role. Place it after the `authenticate` middleware.
 */
export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ message: "Only admins can access this" });
  }
  next();
}
