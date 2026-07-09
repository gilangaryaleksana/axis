import { Router } from "express";
import passport from "@/config/passport";
import { oauthCallback, getMe, logout, register, login } from "@/controllers/auth.controller";
import { authenticate } from "@/middlewares/auth.middleware";

const router = Router();

// --- Google OAuth ---
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"], session: false })
);
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: "/login" }),
  oauthCallback
);

// --- GitHub OAuth ---
router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"], session: false })
);
router.get(
  "/github/callback",
  passport.authenticate("github", { session: false, failureRedirect: "/login" }),
  oauthCallback
);

// --- Umum ---
router.get("/me", authenticate, getMe);
router.post("/logout", authenticate, logout);

// --- Login Manual ---
router.post("/register", register);
router.post("/login", login);

export default router;
