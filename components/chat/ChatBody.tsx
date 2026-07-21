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
    "translate-y-6 px-5 py-1.5 rounded-r-[50px] rounded-bl-[25px] text-[15px] leading-relaxed max-w-[56ch] bg-[#e7e5e0] text-[#2a2a28]";
  const userBubbleClass =
    "translate-y-6 px-5 py-1.5 rounded-l-[50px] rounded-br-[25px] text-[15px] leading-relaxed max-w-[56ch] bg-[#4d4d4a] text-[#f4f3f0]";

  return (
    <div className="flex-1 overflow-y-auto px-10 py-9 flex flex-col bg-[#2b2b2b] scrollbar-hide">
      <div className="max-w-3xl mx-auto w-full flex flex-col gap-5">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex items-end gap-3 ${m.from === "user" ? "justify-end" : ""}`}
          >
            {/* {m.from === "bot" && (
              <div className="w-[35px] h-[35px] rounded-full bg-[#e7e5e0] flex items-center justify-center shrink-0">
                <PersonaIcon
                  size={18}
                  strokeWidth={1.75}
                  className="text-[#2a2a28]"
                />
              </div>
            )} */}
            <div
              className={`${dmSans.className} ${m.from === "user" ? userBubbleClass : botBubbleClass}`}
            >
              {m.text}
            </div>
            {m.from === "user" && (
              <div className="w-[35px] h-[35px] rounded-full bg-[#4d4d4a] text-white font-semibold flex items-center justify-center shrink-0 text-sm">
                <span>U</span>
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex items-end gap-3">
            {/* <div className="w-[35px] h-[35px] rounded-full bg-[#e7e5e0] flex items-center justify-center shrink-0">
              <PersonaIcon
                size={18}
                strokeWidth={1.75}
                className="text-[#2a2a28]"
              />
            </div> */}
            <div className="translate-y-6 px-5 py-3 flex items-center justify-center">
              <div className="loader" />
            </div>
          </div>
        )}

        <div ref={endRef} />
      </div>
    </div>
  );
}
