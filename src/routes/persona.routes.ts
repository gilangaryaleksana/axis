import { Router } from "express";
import { authenticate, requireAdmin } from "@/middlewares/auth.middleware";
import {
  getAllPersonas,
  createPersona,
  updatePersona,
  deactivatePersona,
} from "@/controllers/persona.controller";

const router = Router();

router.get("/", authenticate, getAllPersonas);
router.post("/", authenticate, requireAdmin, createPersona);
router.patch("/:id", authenticate, requireAdmin, updatePersona);
router.delete("/:id", authenticate, requireAdmin, deactivatePersona);

export default router;
