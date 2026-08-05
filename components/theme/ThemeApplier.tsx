"use client";
import { useEffect, useRef, ReactNode } from "react";
import { useSettings } from "@/lib/settings-context";

export default function ThemeApplier({ children }: { children: ReactNode }) {
  const { data, isLoading } = useSettings();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isLoading) return;

    const applyTheme = (theme: string) => {
      let isDark: boolean;
      if (theme === "system") {
        isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      } else {
        isDark = theme === "dark";
      }
      // toggle on <html> so content portaled to document.body
      // (for example modals) still follow dark/light theme
      document.documentElement.classList.toggle("dark", isDark);
    };

    applyTheme(data.theme);

    if (data.theme === "system") {
      const mq = window.matchMedia("(prefers-color-scheme: dark)");
      const listener = (e: MediaQueryListEvent) =>
        document.documentElement.classList.toggle("dark", e.matches);
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
