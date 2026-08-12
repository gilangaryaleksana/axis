import { Router } from "express";
import {
  getMessages,
  sendMessage,
  updateMessageStatus,
} from "../controllers/message.controller";
import { optionalAuthenticate } from "@/middlewares/auth.middleware";
import { guestMiddleware } from "@/middlewares/guest.middleware";

const router = Router();

router.use(optionalAuthenticate, guestMiddleware);

router.get("/:id/messages", getMessages);
router.post("/:id/messages", sendMessage);
router.patch("/:id/messages/:messageId", updateMessageStatus);

export default router;
