"use client";
import { useEffect, useRef, ReactNode } from "react";
import { useSettings } from "@/lib/settings-context";

export default function ThemeApplier({ children }: { children: ReactNode }) {
  const { data, isLoading } = useSettings();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isLoading || !ref.current) return;
    const el = ref.current;

    const applyTheme = (theme: string) => {
      if (theme === "system") {
        const prefersDark = window.matchMedia(
          "(prefers-color-scheme: dark)",
        ).matches;
        el.classList.toggle("dark", prefersDark);
      } else {
        el.classList.toggle("dark", theme === "dark");
      }
    };

    applyTheme(data.theme);

    if (data.theme === "system") {
      const mq = window.matchMedia("(prefers-color-scheme: dark)");
      const listener = (e: MediaQueryListEvent) =>
        el.classList.toggle("dark", e.matches);
      mq.addEventListener("change", listener);
      return () => mq.removeEventListener("change", listener);
    }
  }, [data.theme, isLoading]);

  return (
    <div ref={ref} className="h-full">
      {children}
    </div>
  );
}
