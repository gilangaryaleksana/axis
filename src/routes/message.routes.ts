import { Router } from "express";
import { getMessages, sendMessage } from "../controllers/message.controller";
// Import fungsi 'authenticate' dari middleware lu
import { authenticate } from "@/middlewares/auth.middleware"; 

const router = Router();

// Endpoint untuk mengambil riwayat chat berdasarkan ID percakapan (Wajib Login)
router.get("/:id/messages", authenticate, getMessages); 

// Endpoint untuk mengirim pesan baru & mendapatkan response AI (Wajib Login)
router.post("/:id/messages", authenticate, sendMessage);

export default router;