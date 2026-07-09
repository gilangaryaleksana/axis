import { Request, Response, NextFunction } from "express";
import { AppError } from "@/utils/AppError";

export function notFoundHandler(req: Request, res: Response) {
  res.status(404).json({ message: `Route ${req.originalUrl} tidak ditemukan` });
}

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) {
  console.error(err);

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ message: err.message });
  }

  res.status(500).json({ message: "Terjadi kesalahan pada server" });
}
