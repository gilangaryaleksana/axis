import { Router } from "express";
import { getMessages, sendMessage } from "../controllers/message.controller";
import { optionalAuthenticate } from "@/middlewares/auth.middleware";
import { guestMiddleware } from "@/middlewares/guest.middleware";

const router = Router();

// Check login if there is a token (optionalAuthenticate), if not fill in guestId from cookie (guestMiddleware)
router.use(optionalAuthenticate, guestMiddleware);

// Endpoint to retrieve chat history based on conversation ID (login required)
router.get("/:id/messages", getMessages);

// Endpoint to send a new message and receive an AI response (login required)
router.post("/:id/messages", sendMessage);

export default router;
