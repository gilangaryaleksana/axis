import { Router } from "express";
import { authenticate } from "@/middlewares/auth.middleware";
import {
  getConversations,
  createConversation,
  getConversationById,
  updateConversation,
  deleteConversation,
} from "@/controllers/conversation.controller";
import {
  getMessages,
  sendMessage,
} from "@/controllers/message.controller";

const router = Router();

router.get("/", authenticate, getConversations);
router.post("/", authenticate, createConversation);
router.get("/:id", authenticate, getConversationById);
router.patch("/:id", authenticate, updateConversation);
router.delete("/:id", authenticate, deleteConversation);

// Nested: pesan dalam satu percakapan
router.get("/:id/messages", authenticate, getMessages);
router.post("/:id/messages", authenticate, sendMessage);

export default router;
