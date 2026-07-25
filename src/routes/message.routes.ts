import { Router } from "express";
import { getMessages, sendMessage } from "../controllers/message.controller";
// Import the 'authenticate' function from the middleware
import { authenticate } from "@/middlewares/auth.middleware";

const router = Router();

// Endpoint to retrieve chat history based on conversation ID (login required)
router.get("/:id/messages", authenticate, getMessages);

// Endpoint to send a new message and receive an AI response (login required)
router.post("/:id/messages", authenticate, sendMessage);

export default router;
