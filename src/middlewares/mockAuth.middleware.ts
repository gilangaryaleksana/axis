import { Request, Response, NextFunction } from "express";

const GUEST_USER_ID = process.env.GUEST_USER_ID!;

export function mockAuth(req: Request, res: Response, next: NextFunction) {
  req.user = { id: GUEST_USER_ID } as any;
  next();
}
