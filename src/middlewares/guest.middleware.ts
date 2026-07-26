import { Request, Response, NextFunction } from "express";
import { randomUUID } from "crypto";

export function guestMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (req.user) return next(); // already logged in, skip

  let guestId = req.cookies?.guest_id;

  if (!guestId) {
    guestId = randomUUID(); // UNIQUE per browser, not hardcoded
    res.cookie("guest_id", guestId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24 * 30,
    });
  }

  req.guestId = guestId;
  next();
}
