import { Request, Response, NextFunction } from "express";
import { prisma } from "@/config/prisma";
import { verifyJwt } from "@/utils/jwt";

/**
 * Wajib login. Ambil token dari header "Authorization: Bearer <token>".
 * Kalau valid, isi req.user supaya bisa dipakai controller berikutnya.
 */
export async function authenticate(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Belum login" });
    }

    const token = authHeader.split(" ")[1];
    const payload = verifyJwt(token);

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, role: true, defaultPersona: true, isActive: true },
    });

    if (!user || !user.isActive) {
      return res.status(401).json({ message: "User tidak ditemukan atau nonaktif" });
    }

    req.user = {
      id: user.id,
      role: user.role,
      defaultPersona: user.defaultPersona,
    };
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token tidak valid atau kedaluwarsa" });
  }
}

/**
 * Wajib role admin. Pasang setelah middleware `authenticate`.
 */
export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ message: "Hanya admin yang boleh mengakses ini" });
  }
  next();
}
