"use client";

import { createContext, useContext, useRef } from "react";
import type Lenis from "lenis";

type LenisContextType = {
  lenisRef: React.RefObject<Lenis | null>;
};

const LenisContext = createContext<LenisContextType | null>(null);

export function useLenis() {
  const ctx = useContext(LenisContext);
  if (!ctx) throw new Error("useLenis must be used inside LenisProvider");
  return ctx.lenisRef;
}

export { LenisContext };
