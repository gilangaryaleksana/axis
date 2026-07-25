import { Request, Response } from "express";
import { prisma } from "@/config/prisma";
import { asyncHandler } from "@/utils/asyncHandler";
import { AppError } from "@/utils/AppError";

// GET /api/personas — list of active personas (use case: selecting a persona)
export const getAllPersonas = asyncHandler(
  async (req: Request, res: Response) => {
    const personas = await prisma.persona.findMany({
      where: { isActive: true },
      orderBy: { displayName: "asc" },
    });
    res.json(personas);
  },
);

// POST /api/personas — admin creates a new persona
export const createPersona = asyncHandler(
  async (req: Request, res: Response) => {
    const { type, displayName, description, systemPrompt, avatarUrl } =
      req.body;

    if (!type || !displayName || !systemPrompt) {
      throw new AppError(
        "type, displayName, and systemPrompt are required",
        400,
      );
    }

    const persona = await prisma.persona.create({
      data: {
        type,
        displayName,
        description,
        systemPrompt,
        avatarUrl,
        createdById: req.user!.id,
      },
    });

    res.status(201).json(persona);
  },
);

// PATCH /api/personas/:id — admin updates persona data
export const updatePersona = asyncHandler(
  async (req: Request, res: Response) => {
    const persona = await prisma.persona.update({
      where: { id: req.params.id },
      data: req.body,
    });
    res.json(persona);
  },
);

// DELETE /api/personas/:id — admin deactivates a persona (soft delete)
export const deactivatePersona = asyncHandler(
  async (req: Request, res: Response) => {
    await prisma.persona.update({
      where: { id: req.params.id },
      data: { isActive: false },
    });
    res.json({ message: "Persona deactivated" });
  },
);
