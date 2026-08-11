"use client";

import { useEffect, useRef } from "react";
import { useLenis } from "../lib/lenis-context";

type MorphStyle = {
  width: number;
  height: number;
  radius: number;
  opacity: number;
};

const SPEED = 0.15;

// remap: ubah progress 0-1 jadi sub-range tertentu, lalu clamp 0-1 lagi
function remap(p: number, start: number, end: number) {
  const t = (p - start) / (end - start);
  return Math.min(Math.max(t, 0), 1);
}

export function useScrollMorph(start: MorphStyle, end: MorphStyle) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const lenisRef = useLenis();

  const progressTarget = useRef(0);
  const progressCurrent = useRef(0);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const target = targetRef.current;
    const lenis = lenisRef.current;
    if (!wrapper || !target || !lenis) return;

    const onScroll = () => {
      const rect = wrapper.getBoundingClientRect();
      const vh = window.innerHeight;
      const scrollable = wrapper.offsetHeight - vh;
      progressTarget.current = Math.min(Math.max(-rect.top / scrollable, 0), 1);
    };

    let rafId: number;
    const animate = () => {
      progressCurrent.current +=
        (progressTarget.current - progressCurrent.current) * SPEED;

      const p = progressCurrent.current;
      const lerp = (a: number, b: number) => a + (b - a) * p;

      target.style.width = `${lerp(start.width, end.width)}px`;
      target.style.height = `${lerp(start.height, end.height)}px`;
      target.style.radius =
        target.style.borderRadius = `${lerp(start.radius, end.radius)}px`;

      // TEXT: pakai progress yang di-remap, selesai duluan (misal di 0 - 0.4 dari scroll total)
      if (textRef.current) {
        const textProgress = remap(p, 0, 0.4); // ← atur di sini
        textRef.current.style.opacity =
          `${lerp(start.opacity, end.opacity)}`.replace("REPLACE", "");
        textRef.current.style.opacity = `${start.opacity + (end.opacity - start.opacity) * textProgress}`;
      }

      rafId = requestAnimationFrame(animate);
    };

    lenis.on("scroll", onScroll);
    onScroll();
    rafId = requestAnimationFrame(animate);

    return () => {
      lenis.off("scroll", onScroll);
      cancelAnimationFrame(rafId);
    };
  }, [lenisRef, start, end]);

  return { wrapperRef, targetRef, textRef };
}
