import { Request, Response } from "express";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { prisma } from "@/config/prisma";
import { findOrCreateUser } from "@/config/passport";
import { signJwt } from "@/utils/jwt";
import { asyncHandler } from "@/utils/asyncHandler";
import { OAuth2Client } from "google-auth-library";

// 1. OAuth Callback (Google/GitHub)
export const oauthCallback = asyncHandler(
  async (req: Request, res: Response) => {
    const user = req.user as any;

    const token = signJwt({ userId: user.id, role: user.role });

    await prisma.session.create({
      data: {
        userId: user.id,
        sessionToken: crypto.randomUUID(),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    const redirectUrl = `${process.env.FRONTEND_URL}/auth/callback?token=${token}`;
    res.redirect(redirectUrl);
  },
);

// 2. GET /api/auth/me
export const getMe = asyncHandler(async (req: Request, res: Response) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user!.id },
    select: {
      id: true,
      name: true,
      email: true,
      avatarUrl: true,
      role: true,
      defaultPersona: true,
      createdAt: true,
    },
  });
  res.json(user);
});

// 3. POST /api/auth/register (Manual)
export const register = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    res.status(409);
    throw new Error("Email sudah terdaftar");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name: email.split("@")[0],
    },
  });

  const token = signJwt({ userId: newUser.id, role: newUser.role });

  res.status(201).json({
    message: "Register berhasil",
    token,
    user: { id: newUser.id, email: newUser.email },
  });
});

// 4. POST /api/auth/login (Manual)
export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || !user.password) {
    res.status(401);
    throw new Error("Email atau password salah");
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    res.status(401);
    throw new Error("Email atau password salah");
  }

  const token = signJwt({ userId: user.id, role: user.role });

  res.json({
    message: "Login berhasil",
    token,
    user: { id: user.id, email: user.email, role: user.role },
  });
});

// 5. POST /api/auth/logout
export const logout = asyncHandler(async (req: Request, res: Response) => {
  res.json({ message: "Logout berhasil" });
});

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleOneTap = asyncHandler(
  async (req: Request, res: Response) => {
    const { idToken } = req.body;

    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload?.email) {
      res.status(401);
      throw new Error("Token Google tidak valid");
    }

    const user = await findOrCreateUser({
      provider: "google",
      providerAccountId: payload.sub,
      email: payload.email,
      name: payload.name || payload.email.split("@")[0],
      avatarUrl: payload.picture,
    });

    const token = signJwt({ userId: user.id, role: user.role });

    res.json({
      token,
      user: { id: user.id, email: user.email, name: user.name },
    });
  },
);