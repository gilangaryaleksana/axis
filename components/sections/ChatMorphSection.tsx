"use client";

import ChatWindow from "../ui/ChatWindow";
import { useScrollMorph } from "../../hooks/useScrollMorph";
import { dmSans } from "../../lib/font";

export default function ChatMorphSection() {
  const { wrapperRef, targetRef, textRef } = useScrollMorph(
    {
      width: window.innerWidth,
      height: window.innerHeight,
      radius: 0,
      opacity: 1,
    },
    { width: 768, height: 320, radius: 65, opacity: 0 },
  );

  return (
    <div ref={wrapperRef} className="relative h-[150vh] w-full">
      <div className="sticky top-0 w-full flex flex-col items-center justify-center">
        {/* Text di tengah, fade barengan shrink */}
        <div
          ref={textRef}
          className="absolute z-10 text-center pointer-events-none"
        >
          <h2
            className={`text-2xl font-light text-neutral-600 ${dmSans.className}`}
          >
            Talk to someone, not something
          </h2>
        </div>

        <ChatWindow ref={targetRef} />
      </div>
    </div>
  );
}
