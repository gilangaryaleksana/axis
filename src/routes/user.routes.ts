import { Router } from "express";
import { authenticate } from "@/middlewares/auth.middleware";
import { setDefaultPersona } from "@/controllers/user.controller";

const router = Router();

router.patch("/persona", authenticate, setDefaultPersona);

export default router;
