import { Request, Response } from "express";
import { ethers } from "ethers";
import { prisma } from "@/config/prisma";
import { signJwt } from "@/utils/jwt";
import { asyncHandler } from "@/utils/asyncHandler";
import { migrateGuestConversations } from "./conversation.controller";
import crypto from "crypto";

// 1. GET nonce
export const getNonce = asyncHandler(async (req: Request, res: Response) => {
  const address = (req.query.address as string)?.toLowerCase();
  if (!address) {
    res.status(400);
    throw new Error("Wallet address is required");
  }

  const nonce = crypto.randomBytes(16).toString("hex");

  const existing = await prisma.user.findUnique({
    where: { walletAddress: address },
  });

  await prisma.user.upsert({
    where: { walletAddress: address },
    update: { nonce },
    create: {
      walletAddress: address,
      name: `Wallet_${address.slice(0, 6)}`,
      nonce,
    },
  });

  res.json({
    message: `Axis - Sign this message to login: ${nonce}`,
    nonce,
    isNewUser: !existing,
  });
});

// 2. Verify signature
export const verifyWallet = asyncHandler(
  async (req: Request, res: Response) => {
    const { address, signature } = req.body;
    const walletAddress = address?.toLowerCase();

    const user = await prisma.user.findUnique({ where: { walletAddress } });
    if (!user || !user.nonce) {
      res.status(400);
      throw new Error("Nonce not found, request a nonce first");
    }

    const message = `Axis - Sign this message to login: ${user.nonce}`;
    const recoveredAddress = ethers.verifyMessage(message, signature);

    if (recoveredAddress.toLowerCase() !== walletAddress) {
      res.status(401);
      throw new Error("Invalid signature");
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { nonce: crypto.randomBytes(16).toString("hex") },
    });

    const token = signJwt({ userId: user.id, role: user.role });

    await prisma.session.create({
      data: {
        userId: user.id,
        sessionToken: crypto.randomUUID(),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax" as const,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    };
    res.cookie("token", token, cookieOptions);

    if (req.guestId) {
      await migrateGuestConversations(req.guestId, user.id);
      res.clearCookie("guest_id");
    }

    const { nonce: _, ...safeUser } = user;
    res.json({
      message: "Wallet login successful",
      user: safeUser,
      isNewUser: !user.defaultPersona,
    });
  },
);
