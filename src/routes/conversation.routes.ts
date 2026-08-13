import { Router } from "express";
import { optionalAuthenticate } from "@/middlewares/auth.middleware";
import { guestMiddleware } from "@/middlewares/guest.middleware";
import {
  getConversations,
  createConversation,
  getConversationById,
  updateConversation,
  deleteConversation,
  clearAllConversations,
} from "@/controllers/conversation.controller";
import {
  getMessages,
  sendMessage,
  updateMessageStatus,
} from "@/controllers/message.controller";

const router = Router();

router.use(optionalAuthenticate, guestMiddleware);

router.get("/", getConversations);
router.post("/", createConversation);
router.delete("/clear", clearAllConversations);
router.get("/:id", getConversationById);
router.patch("/:id", updateConversation);
router.delete("/:id", deleteConversation);

router.get("/:id/messages", getMessages);
router.post("/:id/messages", sendMessage);
router.patch("/:id/messages/:messageId", updateMessageStatus);

export default router;
