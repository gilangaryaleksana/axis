import { Router } from "express";
import authRoutes from "@/routes/auth.routes";
import userRoutes from "@/routes/user.routes";
import personaRoutes from "@/routes/persona.routes";
import conversationRoutes from "@/routes/conversation.routes";
import adminRoutes from "@/routes/admin.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/user", userRoutes);
router.use("/personas", personaRoutes);
router.use("/conversations", conversationRoutes);
router.use("/admin", adminRoutes);

export default router;
