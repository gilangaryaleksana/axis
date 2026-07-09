import { Request, Response } from "express";
import { prisma } from "@/config/prisma";
import { asyncHandler } from "@/utils/asyncHandler";

// GET /api/admin/users
export const getAllUsers = asyncHandler(async (req: Request, res: Response) => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      defaultPersona: true,
      isActive: true,
      createdAt: true,
      _count: { select: { conversations: true } },
    },
    orderBy: { createdAt: "desc" },
  });
  res.json(users);
});

// GET /api/admin/personas — termasuk yang nonaktif
export const getAllPersonasAdmin = asyncHandler(async (req: Request, res: Response) => {
  const personas = await prisma.persona.findMany({
    include: { _count: { select: { conversations: true } } },
    orderBy: { createdAt: "asc" },
  });
  res.json(personas);
});
