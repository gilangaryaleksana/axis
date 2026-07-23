import { Request, Response } from "express";
import { prisma } from "@/config/prisma";
import { asyncHandler } from "@/utils/asyncHandler";
import { AppError } from "@/utils/AppError";

// GET /api/conversations/:id/messages
export const getMessages = asyncHandler(async (req: Request, res: Response) => {
  const conversation = await prisma.conversation.findFirst({
    where: { id: req.params.id, userId: req.user!.id, isDeleted: false },
  });
  if (!conversation) throw new AppError("Percakapan tidak ditemukan", 404);

  const messages = await prisma.message.findMany({
    where: { conversationId: req.params.id },
    orderBy: { createdAt: "asc" },
  });
  res.json(messages);
});

// POST /api/conversations/:id/messages
// Body: { "content": "teks pesan dari user" }
// Use case: Mengirim Pesan & Menerima Respons
export const sendMessage = asyncHandler(async (req: Request, res: Response) => {
  const conversation = await prisma.conversation.findFirst({
    where: { id: req.params.id, userId: req.user!.id, isDeleted: false },
    include: { persona: true },
  });
  if (!conversation) throw new AppError("Percakapan tidak ditemukan", 404);

  const content = (req.body?.content as string)?.trim();
  if (!content) throw new AppError("content pesan tidak boleh kosong", 400);

  const userMessage = await prisma.message.create({
    data: { conversationId: req.params.id, sender: "user", content },
  });

  const botReplyText = await generateBotReply(
    conversation.persona.systemPrompt,
    content,
  );

  const botMessage = await prisma.message.create({
    data: {
      conversationId: req.params.id,
      sender: "bot",
      content: botReplyText,
    },
  });

  await prisma.conversation.update({
    where: { id: req.params.id },
    data: { updatedAt: new Date() },
  });

  res.status(201).json({ userMessage, botMessage });
});

/**
 * Placeholder pemanggilan AI. Ganti dengan integrasi Anthropic API sesungguhnya:
 *
 * const result = await fetch("https://api.anthropic.com/v1/messages", {
 *   method: "POST",
 *   headers: {
 *     "x-api-key": process.env.ANTHROPIC_API_KEY!,
 *     "anthropic-version": "2023-06-01",
 *     "content-type": "application/json",
 *   },
 *   body: JSON.stringify({
 *     model: "claude-sonnet-4-6",
 *     max_tokens: 1000,
 *     system: systemPrompt,
 *     messages: [{ role: "user", content: userText }],
 *   }),
 * });
 * const data = await result.json();
 * return data.content[0].text;
 */
async function generateBotReply(
  systemPrompt: string,
  userText: string,
): Promise<string> {
  const response = await fetch(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userText },
        ],
      }),
    },
  );

  if (!response.ok) throw new AppError("Gagal memanggil AI", 502);

  const data = await response.json();
  return data.choices[0].message.content;
}
