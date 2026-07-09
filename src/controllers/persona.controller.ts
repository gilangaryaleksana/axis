import { Request, Response } from "express";
import { prisma } from "@/config/prisma";
import { asyncHandler } from "@/utils/asyncHandler";
import { AppError } from "@/utils/AppError";

// GET /api/personas — daftar persona aktif (use case: Memilih Persona)
export const getAllPersonas = asyncHandler(async (req: Request, res: Response) => {
  const personas = await prisma.persona.findMany({
    where: { isActive: true },
    orderBy: { displayName: "asc" },
  });
  res.json(personas);
});

// POST /api/personas — admin menambah persona baru
export const createPersona = asyncHandler(async (req: Request, res: Response) => {
  const { type, displayName, description, systemPrompt, avatarUrl } = req.body;

  if (!type || !displayName || !systemPrompt) {
    throw new AppError("type, displayName, dan systemPrompt wajib diisi", 400);
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
});

// PATCH /api/personas/:id — admin update data persona
export const updatePersona = asyncHandler(async (req: Request, res: Response) => {
  const persona = await prisma.persona.update({
    where: { id: req.params.id },
    data: req.body,
  });
  res.json(persona);
});

// DELETE /api/personas/:id — admin nonaktifkan persona (soft delete)
export const deactivatePersona = asyncHandler(async (req: Request, res: Response) => {
  await prisma.persona.update({
    where: { id: req.params.id },
    data: { isActive: false },
  });
  res.json({ message: "Persona dinonaktifkan" });
});
