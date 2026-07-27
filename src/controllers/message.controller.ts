import { Request, Response } from "express";
import { prisma } from "@/config/prisma";
import { asyncHandler } from "@/utils/asyncHandler";
import { AppError } from "@/utils/AppError";

// GET /api/conversations/:id/messages
export const getMessages = asyncHandler(async (req: Request, res: Response) => {
  const ownerId = req.user?.id;
  const guestId = req.guestId;

  if (!ownerId && !guestId) {
    throw new AppError("No user or guest identity found", 400);
  }

  const conversation = await prisma.conversation.findFirst({
    where: {
      id: req.params.id,
      isDeleted: false,
      ...(ownerId ? { userId: ownerId } : { guestId }),
    },
  });
  if (!conversation) throw new AppError("Conversation not found", 404);

  const messages = await prisma.message.findMany({
    where: { conversationId: req.params.id },
    orderBy: { createdAt: "asc" },
  });
  res.json(messages);
});

// POST /api/conversations/:id/messages
export const sendMessage = asyncHandler(async (req: Request, res: Response) => {
  const ownerId = req.user?.id;
  const guestId = req.guestId;

  if (!ownerId && !guestId) {
    throw new AppError("No user or guest identity found", 400);
  }

  const conversation = await prisma.conversation.findFirst({
    where: {
      id: req.params.id,
      isDeleted: false,
      ...(ownerId ? { userId: ownerId } : { guestId }),
    },
    include: { persona: true },
  });
  if (!conversation) throw new AppError("Conversation not found", 404);

  const content = (req.body?.content as string)?.trim();
  if (!content) throw new AppError("Message content cannot be empty", 400);

  // First check whether this is the FIRST message in this conversation (before insert)
  const messageCount = await prisma.message.count({
    where: { conversationId: req.params.id },
  });
  const isFirstMessage = messageCount === 0;

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

  // If this is the first message, automatically generate the title from the message content
  let updatedTitle = conversation.title;
  if (isFirstMessage) {
    updatedTitle = await generateConversationTitle(content);
  }

  await prisma.conversation.update({
    where: { id: req.params.id },
    data: { updatedAt: new Date(), title: updatedTitle },
  });

  res.status(201).json({ userMessage, botMessage, title: updatedTitle });
});

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

  if (!response.ok) throw new AppError("Failed to call the AI service", 502);

  const data = await response.json();
  return data.choices[0].message.content;
}

async function generateConversationTitle(userMessage: string): Promise<string> {
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
          {
            role: "system",
            content:
              "Create a short title (max 5 words) that summarizes the topic of the following message, in the SAME language as the message. Reply with ONLY the title, no quotes, no additional explanation.",
          },
          { role: "user", content: userMessage },
        ],
        max_tokens: 20,
        temperature: 0.5,
      }),
    },
  );

  if (!response.ok) return "New Conversation";

  const data = await response.json();
  return data.choices[0].message.content.trim();
}
