import { Request, Response } from "express";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { prisma } from "@/config/prisma";
import { findOrCreateUser } from "@/config/passport";
import { signJwt } from "@/utils/jwt";
import { asyncHandler } from "@/utils/asyncHandler";
import { OAuth2Client } from "google-auth-library";
import { migrateGuestConversations } from "./conversation.controller";
import { AppError } from "../utils/AppError";

// 1. OAuth Callback (Google/GitHub via Passport redirect flow)
export const oauthCallback = asyncHandler(
  async (req: Request, res: Response) => {
    const user = req.user as any;

    if (req.guestId) {
      await migrateGuestConversations(req.guestId, user.id);
      res.clearCookie("guest_id");
    }

    const token = signJwt({ userId: user.id, role: user.role });

    await prisma.session.create({
      data: {
        userId: user.id,
        sessionToken: crypto.randomUUID(),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    const redirectUrl = `${process.env.FRONTEND_URL}/auth/callback?token=${token}&isNewUser=${user.isNewUser ?? false}`;
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
      language: true,
      autoGenerateTitle: true,
      theme: true,
      compactSidebar: true,
      emailNotifications: true,
      inAppSound: true,
      tradingGoal: true,
      tradingBackground: true,
      communicationStyle: true,
      tradingInstrument: true,
      tradingStruggle: true,
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
    throw new AppError("Email already registered", 409);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name: email.split("@")[0],
    },
  });

  if (req.guestId) {
    await migrateGuestConversations(req.guestId, newUser.id);
    res.clearCookie("guest_id");
  }

  const token = signJwt({ userId: newUser.id, role: newUser.role });

  res.status(201).json({
    message: "Registration successful",
    token,
    user: { id: newUser.id, email: newUser.email },
  });
});

// 4. POST /api/auth/login (Manual)
export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || !user.password) {
    throw new AppError("Email or password is incorrect", 401);
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    throw new AppError("Email or password is incorrect", 401);
  }

  if (req.guestId) {
    await migrateGuestConversations(req.guestId, user.id);
    res.clearCookie("guest_id");
  }

  const token = signJwt({ userId: user.id, role: user.role });

  res.json({
    message: "Login successful",
    token,
    user: { id: user.id, email: user.email, role: user.role },
  });
});

// 5. POST /api/auth/logout
export const logout = asyncHandler(async (req: Request, res: Response) => {
  res.json({ message: "Logout successful" });
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
      throw new AppError("Google token is invalid", 401);
    }

    const user = await findOrCreateUser({
      provider: "google",
      providerAccountId: payload.sub,
      email: payload.email,
      name: payload.name || payload.email.split("@")[0],
      avatarUrl: payload.picture,
    });

    if (req.guestId) {
      await migrateGuestConversations(req.guestId, user.id);
      res.clearCookie("guest_id");
    }

    const token = signJwt({ userId: user.id, role: user.role });

    res.json({
      token,
      user: { id: user.id, email: user.email, name: user.name },
    });
  },
);

// 6. PATCH /api/auth/me
export const updateMe = asyncHandler(async (req: Request, res: Response) => {
  const {
    name,
    language,
    defaultPersona,
    autoGenerateTitle,
    theme,
    compactSidebar,
    emailNotifications,
    inAppSound,
    tradingGoal,
    tradingBackground,
    communicationStyle,
    tradingInstrument,
    tradingStruggle,
  } = req.body;

  const updated = await prisma.user.update({
    where: { id: req.user!.id },
    data: {
      ...(name !== undefined && { name }),
      ...(language !== undefined && { language }),
      ...(defaultPersona !== undefined && { defaultPersona }),
      ...(autoGenerateTitle !== undefined && { autoGenerateTitle }),
      ...(theme !== undefined && { theme }),
      ...(compactSidebar !== undefined && { compactSidebar }),
      ...(emailNotifications !== undefined && { emailNotifications }),
      ...(inAppSound !== undefined && { inAppSound }),
      ...(tradingGoal !== undefined && { tradingGoal }),
      ...(tradingBackground !== undefined && { tradingBackground }),
      ...(communicationStyle !== undefined && { communicationStyle }),
      ...(tradingInstrument !== undefined && { tradingInstrument }),
      ...(tradingStruggle !== undefined && { tradingStruggle }),
    },
    select: {
      id: true,
      name: true,
      email: true,
      avatarUrl: true,
      role: true,
      defaultPersona: true,
      language: true,
      autoGenerateTitle: true,
      theme: true,
      compactSidebar: true,
      emailNotifications: true,
      inAppSound: true,
      createdAt: true,
    },
  });

  res.json(updated);
});

// 7. DELETE /api/auth/me
export const deleteAccount = asyncHandler(
  async (req: Request, res: Response) => {
    await prisma.user.delete({
      where: { id: req.user!.id },
    });
    res.json({ message: "Account deleted successfully" });
  },
);
