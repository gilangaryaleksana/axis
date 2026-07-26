import "express";

declare global {
  namespace Express {
    interface User {
      id: string;
      role: string;
      defaultPersona?: string | null;
    }

    interface Request {
      guestId?: string;
    }
  }
}

export {};
