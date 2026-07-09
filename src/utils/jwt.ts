import jwt, { SignOptions } from "jsonwebtoken";

export interface JwtPayload {
  userId: string;
  role: "user" | "admin";
}

export function signJwt(payload: JwtPayload): string {
  const expiresIn = (process.env.JWT_EXPIRES_IN || "7d") as SignOptions["expiresIn"];

  return jwt.sign(payload, process.env.JWT_SECRET as string, {
    expiresIn,
  });
}

export function verifyJwt(token: string): JwtPayload {
  return jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
}