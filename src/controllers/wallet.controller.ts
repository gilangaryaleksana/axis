import { Request, Response } from "express";
import { ethers } from "ethers";
import { prisma } from "@/config/prisma";
import { signJwt } from "@/utils/jwt";
import { asyncHandler } from "@/utils/asyncHandler";
import crypto from "crypto";

// 1. GET nonce
export const getNonce = asyncHandler(async (req: Request, res: Response) => {
  const address = (req.query.address as string)?.toLowerCase();
  if (!address) {
    res.status(400);
    throw new Error("Address wallet wajib diisi");
  }

  const nonce = crypto.randomBytes(16).toString("hex");

  const user = await prisma.user.upsert({
    where: { walletAddress: address },
    update: { nonce },
    create: {
      walletAddress: address,
      name: `Wallet_${address.slice(0, 6)}`,
      nonce,
    },
  });

  res.json({
    message: `Sign this message to login: ${nonce}`,
    nonce,
  });
});

// 2. Verify signature
export const verifyWallet = asyncHandler(async (req: Request, res: Response) => {
  const { address, signature } = req.body;
  const walletAddress = address?.toLowerCase();

  const user = await prisma.user.findUnique({ where: { walletAddress } });
  if (!user || !user.nonce) {
    res.status(400);
    throw new Error("Nonce tidak ditemukan, request nonce dulu");
  }

  const message = `Sign this message to login: ${user.nonce}`;
  const recoveredAddress = ethers.verifyMessage(message, signature);

  if (recoveredAddress.toLowerCase() !== walletAddress) {
    res.status(401);
    throw new Error("Signature tidak valid");
  }

  // Nonce sekali pakai — reset setelah berhasil
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

  res.json({ message: "Login wallet berhasil", token, user });
});