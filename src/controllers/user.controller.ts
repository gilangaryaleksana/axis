import { Request, Response } from "express";
import { prisma } from "@/config/prisma";
import { asyncHandler } from "@/utils/asyncHandler";
import { AppError } from "@/utils/AppError";
import { PersonaType } from "@prisma/client";

const VALID_TYPES: PersonaType[] = ["tentara", "polisi", "dokter", "guru"];

// PATCH /api/user/persona
// Body: { "persona": "tentara" | "polisi" | "dokter" | "guru" }
// Dipanggil saat register/onboarding pertama kali
export const setDefaultPersona = asyncHandler(async (req: Request, res: Response) => {
  const persona = req.body?.persona as PersonaType;

  if (!persona || !VALID_TYPES.includes(persona)) {
    throw new AppError(
      "Pilihan role tidak valid. Gunakan: tentara, polisi, dokter, guru",
      400
    );
  }

  const updated = await prisma.user.update({
    where: { id: req.user!.id },
    data: { defaultPersona: persona },
    select: { id: true, defaultPersona: true },
  });

  res.json(updated);
});
