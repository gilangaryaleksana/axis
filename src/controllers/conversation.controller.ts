import { Request, Response } from "express";
import { prisma } from "@/config/prisma";
import { asyncHandler } from "@/utils/asyncHandler";
import { AppError } from "@/utils/AppError";

// GET /api/conversations — user's conversation history (use case: viewing the history list)
export const getConversations = asyncHandler(
  async (req: Request, res: Response) => {
    const conversations = await prisma.conversation.findMany({
      where: { userId: req.user!.id, isDeleted: false },
      include: { persona: true },
      orderBy: { updatedAt: "desc" },
    });
    res.json(conversations);
  },
);

// POST /api/conversations — start a new conversation (use case: starting a new conversation)
// Body: { "personaId": "...", "title"?: "..." }
export const createConversation = asyncHandler(
  async (req: Request, res: Response) => {
    const { personaId, title } = req.body;
    if (!personaId) throw new AppError("personaId is required", 400);

    const persona = await prisma.persona.findUnique({
      where: { id: personaId },
    });
    if (!persona || !persona.isActive) {
      throw new AppError("Persona not found or inactive", 404);
    }

    const conversation = await prisma.conversation.create({
      data: {
        userId: req.user!.id,
        personaId,
        title: title ?? `Conversation with ${persona.displayName}`,
      },
      include: { persona: true },
    });

    res.status(201).json(conversation);
  },
);

// GET /api/conversations/:id — continue an existing conversation (with messages)
export const getConversationById = asyncHandler(
  async (req: Request, res: Response) => {
    const conversation = await prisma.conversation.findFirst({
      where: { id: req.params.id, userId: req.user!.id, isDeleted: false },
      include: { persona: true, messages: { orderBy: { createdAt: "asc" } } },
    });

    if (!conversation) throw new AppError("Conversation not found", 404);
    res.json(conversation);
  },
);

// PATCH /api/conversations/:id — rename a conversation
export const updateConversation = asyncHandler(
  async (req: Request, res: Response) => {
    const owned = await prisma.conversation.findFirst({
      where: { id: req.params.id, userId: req.user!.id, isDeleted: false },
    });
    if (!owned) throw new AppError("Conversation not found", 404);

    const updated = await prisma.conversation.update({
      where: { id: req.params.id },
      data: { title: req.body.title },
    });
    res.json(updated);
  },
);

// DELETE /api/conversations/:id — delete a conversation (use case: deleting a conversation)
export const deleteConversation = asyncHandler(
  async (req: Request, res: Response) => {
    const owned = await prisma.conversation.findFirst({
      where: { id: req.params.id, userId: req.user!.id, isDeleted: false },
    });
    if (!owned) throw new AppError("Conversation not found", 404);

    await prisma.conversation.update({
      where: { id: req.params.id },
      data: { isDeleted: true, deletedAt: new Date() },
    });
    res.json({ message: "Conversation deleted successfully" });
  },
);
