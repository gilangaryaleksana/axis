import { Router } from "express";
import passport from "@/config/passport";
import {
  oauthCallback,
  getMe,
  updateMe,
  logout,
  register,
  login,
  googleOneTap,
  deleteAccount,
} from "@/controllers/auth.controller";
import { getNonce, verifyWallet } from "@/controllers/wallet.controller";
import { authenticate } from "@/middlewares/auth.middleware";
import { guestMiddleware } from "@/middlewares/guest.middleware";

const router = Router();

// --- Google OAuth ---
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  }),
);
router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: `${process.env.FRONTEND_URL}/login?error=auth_failed`,
  }),
  guestMiddleware, // setelah passport, req.user udah keisi -> guestMiddleware skip generate baru
  oauthCallback,
);

// --- GitHub OAuth ---
router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"], session: false }),
);
router.get(
  "/github/callback",
  passport.authenticate("github", {
    session: false,
    failureRedirect: `${process.env.FRONTEND_URL}/login?error=auth_failed`,
  }),
  guestMiddleware,
  oauthCallback,
);

// --- Wallet Login ---
router.get("/wallet/nonce", getNonce);
router.post("/wallet/verify", guestMiddleware, verifyWallet);

// --- General ---
router.get("/me", authenticate, getMe);
router.patch("/me", authenticate, updateMe);
router.post("/logout", authenticate, logout);

// --- Manual login (requires guestId from cookie for migration) ---
router.post("/register", guestMiddleware, register);
router.post("/login", guestMiddleware, login);

// --- One Tap Login ---
router.post("/google/onetap", guestMiddleware, googleOneTap);

// --- Manual delete account ---
router.delete("/me", authenticate, deleteAccount);

export default router;
