import { Request, Response } from "express";
import { prisma } from "@/config/prisma";
import { sendMissedReplyEmail } from "@/config/mailer";
import { asyncHandler } from "@/utils/asyncHandler";
import { AppError } from "@/utils/AppError";
import { encrypt, decrypt } from "@/utils/crypto";

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

  const decryptedMessages = messages.map((m) => ({
    ...m,
    content: decrypt(m.content),
  }));
  res.json(decryptedMessages);
});

// Detects if the user message contains a wallet-related intent (e.g., checking balance)
function detectWalletIntent(text: string): "balance" | null {
  const lower = text.toLowerCase();
  if (/saldo|balance|cek.*wallet|cek.*dompet/.test(lower)) return "balance";
  return null;
}

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

  let clientDisconnected = false;
  req.on("close", () => {
    if (!res.writableEnded) {
      clientDisconnected = true;
    }
  });

  let userContext = "";
  if (ownerId) {
    const userProfile = await prisma.user.findUnique({
      where: { id: ownerId },
      select: {
        language: true,
        tradingGoal: true,
        tradingBackground: true,
        tradingInstrument: true,
        tradingStruggle: true,
      },
    });

    if (userProfile) {
      const contextParts: string[] = [];
      if (userProfile.tradingGoal)
        contextParts.push(`Trading goal: ${userProfile.tradingGoal}`);
      if (userProfile.tradingBackground)
        contextParts.push(`Experience level: ${userProfile.tradingBackground}`);
      if (userProfile.tradingInstrument)
        contextParts.push(`Mainly trades: ${userProfile.tradingInstrument}`);
      if (userProfile.tradingStruggle)
        contextParts.push(`Biggest struggle: ${userProfile.tradingStruggle}`);

      if (contextParts.length > 0) {
        userContext = `\n\nUser context:\n${contextParts.join("\n")}`;
      }

      if (userProfile.language === "id") {
        userContext += `\n\nRespond in Bahasa Indonesia.`;
      }
    }
  }

  // First check whether this is the FIRST message in this conversation (before insert)
  const messageCount = await prisma.message.count({
    where: { conversationId: req.params.id },
  });
  const isFirstMessage = messageCount === 0;

  const userMessage = await prisma.message.create({
    data: {
      conversationId: req.params.id,
      sender: "user",
      content: encrypt(content),
    },
  });

  const walletIntent = detectWalletIntent(content);

  let botMessage;
  let botReplyText: string;

  if (walletIntent === "balance") {
    // Ambil walletAddress user (kalau ada)
    const userWallet = ownerId
      ? await prisma.user.findUnique({
          where: { id: ownerId },
          select: { walletAddress: true },
        })
      : null;

    if (!userWallet?.walletAddress) {
      botReplyText =
        "Kamu belum menghubungkan wallet. Silakan connect wallet dulu ya.";
      botMessage = await prisma.message.create({
        data: {
          conversationId: req.params.id,
          sender: "bot",
          type: "text",
          content: encrypt(botReplyText),
        },
      });
    } else {
      const payload = JSON.stringify({ address: userWallet.walletAddress });
      botMessage = await prisma.message.create({
        data: {
          conversationId: req.params.id,
          sender: "bot",
          type: "wallet_balance",
          content: encrypt(payload),
        },
      });
      botReplyText = payload; // dipakai buat response JSON di bawah
    }
  } else {
    botReplyText = await generateBotReply(
      conversation.persona.systemPrompt + userContext,
      content,
    );

    botMessage = await prisma.message.create({
      data: {
        conversationId: req.params.id,
        sender: "bot",
        type: "text",
        content: encrypt(botReplyText),
      },
    });
  }

  // If this is the first message, automatically generate the title from the message content
  let updatedTitle = conversation.title;
  if (isFirstMessage) {
    let shouldAutoGenerate = true;

    if (ownerId) {
      const user = await prisma.user.findUnique({
        where: { id: ownerId },
        select: { autoGenerateTitle: true },
      });
      shouldAutoGenerate = user?.autoGenerateTitle ?? true;
    }

    if (shouldAutoGenerate) {
      updatedTitle = await generateConversationTitle(content);
    }
  }

  await prisma.conversation.update({
    where: { id: req.params.id },
    data: { updatedAt: new Date(), title: updatedTitle },
  });

  if (clientDisconnected) {
    if (ownerId) {
      const user = await prisma.user.findUnique({
        where: { id: ownerId },
        select: { email: true, emailNotifications: true },
      });

      if (user?.emailNotifications && user.email) {
        try {
          await sendMissedReplyEmail(
            user.email,
            botReplyText,
            conversation.persona.displayName,
          );
        } catch (err) {
          console.error("Failed to send missed-reply email:", err);
        }
      }
    }
    return;
  }

  res.status(201).json({
    userMessage: { ...userMessage, content },
    botMessage: { ...botMessage, content: botReplyText },
    title: updatedTitle,
  });
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
