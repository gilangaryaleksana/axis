import { useEffect, useRef } from "react";
import { LucideIcon } from "lucide-react";
import { dmSans } from "@/lib/font";

export interface Message {
  from: "bot" | "user";
  text: string;
}

export default function ChatBody({
  messages,
  PersonaIcon,
  isLoading,
}: {
  messages: Message[];
  PersonaIcon: LucideIcon;
  isLoading?: boolean;
}) {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const botBubbleClass =
    "translate-y-4 px-4 md:px-6 py-3 md:py-4 rounded-r-[35px] font-extralight rounded-bl-[25px] text-[14px] md:text-[15px] leading-relaxed max-w-[85%] sm:max-w-[56ch] bg-gray-100 dark:bg-[#e7e5e0] text-[#2a2a28] whitespace-pre-wrap break-words";
  const userBubbleClass =
    "translate-y-4 px-4 md:px-6 py-3 md:py-4 rounded-l-[35px] font-extralight rounded-br-[25px] text-[14px] md:text-[15px] leading-relaxed max-w-[85%] sm:max-w-[56ch] bg-[#2b2b2b] dark:bg-[#4d4d4a] text-white dark:text-[#f4f3f0] whitespace-pre-wrap break-words";

  return (
    <div className="flex-1 overflow-y-auto px-4 md:px-10 pt-20 md:pt-24 pb-6 md:pb-9 flex flex-col bg-white dark:bg-[#202023] chat-scrollbar">
      <div className="max-w-3xl mx-auto w-full flex flex-col gap-4 md:gap-5">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex items-start gap-2 md:gap-3 ${m.from === "user" ? "justify-end" : ""}`}
          >
            <div
              className={`${dmSans.className} ${m.from === "user" ? userBubbleClass : botBubbleClass}`}
            >
              {m.text}
            </div>
            {m.from === "user" && (
              <div
                className={`w-[30px] h-[30px] md:w-[35px] md:h-[35px] rounded-full bg-gray-400 dark:bg-[#4d4d4a] text-white font-semibold flex items-center justify-center shrink-0 text-xs md:text-sm ${dmSans.className}`}
              >
                <span>U</span>
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex items-end gap-3">
            <div className="translate-y-4 px-6 py-4 flex items-center justify-center">
              <div className="loader" />
            </div>
          </div>
        )}

        <div ref={endRef} />
      </div>
    </div>
  );
}
