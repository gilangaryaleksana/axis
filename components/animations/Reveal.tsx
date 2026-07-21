"use client";

import { useInView } from "@/hooks/useInView";

type RevealProps = {
  children: React.ReactNode;
  direction?: "up" | "down" | "left" | "right";
  delay?: number;
  className?: string;
};

export function Reveal({
  children,
  direction = "up",
  delay = 0,
  className = "",
}: RevealProps) {
  const { ref, isInView } = useInView<HTMLDivElement>();

  const directions = {
    up: "translate-y-8",
    down: "-translate-y-8",
    left: "translate-x-8",
    right: "-translate-x-8",
  };

  const visibilityClass = isInView
    ? "opacity-100 translate-x-0 translate-y-0"
    : `opacity-0 ${directions[direction]}`;

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 ease-out ${visibilityClass} ${className}`}
    >
      {children}
    </div>
  );
}
