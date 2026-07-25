import jwt, { SignOptions } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET has not been set in .env");
}

// Store as an explicit typed string constant
const SECRET: string = JWT_SECRET;

export interface JwtPayload {
  userId: string;
  role: "user" | "admin";
}

export function signJwt(payload: JwtPayload): string {
  const expiresIn = (process.env.JWT_EXPIRES_IN ||
    "7d") as SignOptions["expiresIn"];

  return jwt.sign(payload, SECRET, {
    expiresIn,
  });
}

export function verifyJwt(token: string): JwtPayload {
  return jwt.verify(token, SECRET) as JwtPayload;
}
