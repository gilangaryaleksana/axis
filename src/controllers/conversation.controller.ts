import { Request, Response } from "express";
import { prisma } from "@/config/prisma";
import { asyncHandler } from "@/utils/asyncHandler";
import { AppError } from "@/utils/AppError";

// Small helper so you don't rewrite each function
function getOwnerFilter(req: Request) {
  const ownerId = req.user?.id;
  const guestId = req.guestId;

  if (!ownerId && !guestId) {
    throw new AppError("No user or guest identity found", 400);
  }

  return ownerId ? { userId: ownerId } : { guestId };
}

// GET /api/conversations — conversation history (login or guest)
export const getConversations = asyncHandler(
  async (req: Request, res: Response) => {
    const ownerFilter = getOwnerFilter(req);

    const conversations = await prisma.conversation.findMany({
      where: { ...ownerFilter, isDeleted: false },
      include: { persona: true, _count: { select: { messages: true } } },
      orderBy: { updatedAt: "desc" },
    });
    res.json(conversations);
  },
);

// POST /api/conversations — start a new conversation (login or guest)
export const createConversation = asyncHandler(
  async (req: Request, res: Response) => {
    const ownerId = req.user?.id;
    const guestId = req.guestId;

    if (!ownerId && !guestId) {
      throw new AppError("No user or guest identity found", 400);
    }

    const { personaId, personaType, title } = req.body;
    if (!personaId && !personaType) {
      throw new AppError("personaId or personaType is required", 400);
    }

    const persona = personaId
      ? await prisma.persona.findUnique({ where: { id: personaId } })
      : await prisma.persona.findUnique({ where: { type: personaType } });

    if (!persona || !persona.isActive) {
      throw new AppError("Persona not found or inactive", 404);
    }

    const conversation = await prisma.conversation.create({
      data: {
        ...(ownerId ? { userId: ownerId } : { guestId }),
        personaId: persona.id,
        title: title ?? `Conversation with ${persona.displayName}`,
      },
      include: { persona: true },
    });

    res.status(201).json(conversation);
  },
);

// GET /api/conversations/:id — continue conversation (with message)
export const getConversationById = asyncHandler(
  async (req: Request, res: Response) => {
    const ownerFilter = getOwnerFilter(req);

    const conversation = await prisma.conversation.findFirst({
      where: { id: req.params.id, ...ownerFilter, isDeleted: false },
      include: { persona: true, messages: { orderBy: { createdAt: "asc" } } },
    });

    if (!conversation) throw new AppError("Conversation not found", 404);
    res.json(conversation);
  },
);

// PATCH /api/conversations/:id — rename conversation
export const updateConversation = asyncHandler(
  async (req: Request, res: Response) => {
    const ownerFilter = getOwnerFilter(req);

    const owned = await prisma.conversation.findFirst({
      where: { id: req.params.id, ...ownerFilter, isDeleted: false },
    });
    if (!owned) throw new AppError("Conversation not found", 404);

    const updated = await prisma.conversation.update({
      where: { id: req.params.id },
      data: { title: req.body.title },
    });
    res.json(updated);
  },
);

// DELETE /api/conversations/:id — delete conversation
export const deleteConversation = asyncHandler(
  async (req: Request, res: Response) => {
    const ownerFilter = getOwnerFilter(req);

    const owned = await prisma.conversation.findFirst({
      where: { id: req.params.id, ...ownerFilter, isDeleted: false },
    });
    if (!owned) throw new AppError("Conversation not found", 404);

    await prisma.conversation.update({
      where: { id: req.params.id },
      data: { isDeleted: true, deletedAt: new Date() },
    });
    res.json({ message: "Conversation deleted successfully" });
  },
);

// Migrate guest conversations
export async function migrateGuestConversations(
  guestId: string,
  userId: string,
) {
  if (!guestId) return;

  await prisma.conversation.updateMany({
    where: { guestId, isDeleted: false },
    data: { userId, guestId: null },
  });
}