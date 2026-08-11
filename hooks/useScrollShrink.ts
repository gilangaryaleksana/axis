"use client";

import { useEffect, useRef } from "react";
import { useLenis } from "../components/providers/SmoothScroll";

export function useScrollShrink<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const lenisRef = useLenis();

  useEffect(() => {
    const el = ref.current;
    const lenis = lenisRef.current;
    if (!el || !lenis) return;

    const onScroll = () => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;

      const progress = Math.min(Math.max(-rect.top / vh, 0), 1);

      const scale = 1 - progress * 0.35;      
      const radius = progress * 65;          

      el.style.transform = `scale(${scale})`;
      el.style.borderRadius = `${radius}px`;
    };

    lenis.on("scroll", onScroll);
    onScroll();

    return () => {
      lenis.off("scroll", onScroll);
    };
  }, [lenisRef]);

  return ref;
}