import { Request, Response } from "express";
import { prisma } from "@/config/prisma";
import { asyncHandler } from "@/utils/asyncHandler";
import { AppError } from "@/utils/AppError";
import { PersonaType } from "@prisma/client";

const VALID_TYPES: PersonaType[] = ["soldier", "police", "doctor", "teacher"];

// PATCH /api/user/persona
// Body: { "persona": "soldier" | "police" | "doctor" | "teacher" }
// Called during registration/onboarding for the first time
export const setDefaultPersona = asyncHandler(
  async (req: Request, res: Response) => {
    const persona = req.body?.persona as PersonaType;

    if (!persona || !VALID_TYPES.includes(persona)) {
      throw new AppError(
        "Invalid role choice. Use: soldier, police, doctor, teacher",
        400,
      );
    }

    const updated = await prisma.user.update({
      where: { id: req.user!.id },
      data: { defaultPersona: persona },
      select: { id: true, defaultPersona: true },
    });

    res.json(updated);
  },
);
