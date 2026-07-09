import { UserRole, PersonaType } from "@prisma/client";

// PENTING: extend interface Express.User (bukan timpa Express.Request),
// karena Passport sudah mendeklarasikan `Request.user?: Express.User`
// bawaan. Kalau kita timpa Request langsung, akan bentrok/konflik tipe
// dengan deklarasi Passport dan bikin error TS di semua file yang
// memakai req.user.
declare global {
  namespace Express {
    interface User {
      id: string;
      role: UserRole;
      defaultPersona: PersonaType | null;
    }
  }
}

export {};