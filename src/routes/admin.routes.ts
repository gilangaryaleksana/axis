import { Router } from "express";
import { authenticate, requireAdmin } from "@/middlewares/auth.middleware";
import { getAllUsers, getAllPersonasAdmin } from "@/controllers/admin.controller";

const router = Router();

router.use(authenticate, requireAdmin);

router.get("/users", getAllUsers);
router.get("/personas", getAllPersonasAdmin);

export default router;
