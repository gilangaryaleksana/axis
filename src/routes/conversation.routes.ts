import { Router } from "express";
import { mockAuth } from "@/middlewares/mockAuth.middleware";
import {
  getConversations,
  createConversation,
  getConversationById,
  updateConversation,
  deleteConversation,
} from "@/controllers/conversation.controller";
import { getMessages, sendMessage } from "@/controllers/message.controller";

const router = Router();

router.get("/", mockAuth, getConversations);
router.post("/", mockAuth, createConversation);
router.get("/:id", mockAuth, getConversationById);
router.patch("/:id", mockAuth, updateConversation);
router.delete("/:id", mockAuth, deleteConversation);

router.get("/:id/messages", mockAuth, getMessages);
router.post("/:id/messages", mockAuth, sendMessage);

export default router;
