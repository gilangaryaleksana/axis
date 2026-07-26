import { Router } from "express";
import { optionalAuthenticate } from "@/middlewares/auth.middleware";
import { guestMiddleware } from "@/middlewares/guest.middleware";
import {
  getConversations,
  createConversation,
  getConversationById,
  updateConversation,
  deleteConversation,
} from "@/controllers/conversation.controller";
import { getMessages, sendMessage } from "@/controllers/message.controller";

const router = Router();

// Check the login if there is a token, if not, fill in the guestId from the cookie
router.use(optionalAuthenticate, guestMiddleware);

router.get("/", getConversations);
router.post("/", createConversation);
router.get("/:id", getConversationById);
router.patch("/:id", updateConversation);
router.delete("/:id", deleteConversation);

router.get("/:id/messages", getMessages);
router.post("/:id/messages", sendMessage);

export default router;
