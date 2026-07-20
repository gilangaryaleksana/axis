"use client";

import { useEffect, useRef } from "react";
import { useLenis } from "../../lib/lenis-context";

export default function ScrollIndicator() {
  const lenisRef = useLenis();
  const thumbRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cleanup: (() => void) | undefined;

    const setup = () => {
      const lenis = lenisRef.current;
      if (!lenis) {
        // Lenis belum siap, coba lagi frame berikutnya
        requestAnimationFrame(setup);
        return;
      }

      const onScroll = ({
        scroll,
        limit,
      }: {
        scroll: number;
        limit: number;
      }) => {
        if (!thumbRef.current) return;
        const progress = limit > 0 ? scroll / limit : 0;

        const trackHeight = window.innerHeight; // full height, gak ada margin lagi
        const thumbHeight = 64; // samain sama h-10 (40px)
        const maxTranslate = trackHeight - thumbHeight;

        thumbRef.current.style.transform = `translateY(${progress * maxTranslate}px)`;
      };

      lenis.on("scroll", onScroll);
      cleanup = () => lenis.off("scroll", onScroll);
    };

    setup();
    return () => cleanup?.();
  }, [lenisRef]);

  return (
    <div className="fixed right-0 top-0 bottom-0 w-1.5 z-50 pointer-events-none">
      <div ref={thumbRef} className="w-full h-16 rounded-full bg-neutral-700" />
    </div>
  );
}
