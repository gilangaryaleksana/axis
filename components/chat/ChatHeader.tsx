import { PanelLeft } from "lucide-react";
import { Persona } from "../persona/personas";
import { dmSans } from "@/lib/font";

export default function ChatHeader({
  persona,
  title,
  className = "",
  onMenuClick,
}: {
  persona: Persona;
  title: string;
  className?: string;
  onMenuClick?: () => void;
}) {
  const Icon = persona.icon;
  return (
    <div className={`absolute top-0 left-0 right-0 z-10 ${className}`}>
      <div className="flex items-center gap-3 md:gap-3.5 px-4 md:px-8 py-3 bg-white dark:bg-[#202023] backdrop-blur-md">
        {/* hamburger, mobile only */}
        <button
          onClick={onMenuClick}
          className="md:hidden shrink-0 w-9 h-9 flex items-center justify-center rounded-lg text-[#1a1a1a] dark:text-[#e8e8e6]"
        >
          <PanelLeft size={20} strokeWidth={1.75} />
        </button>

        <div className="w-[35px] h-[35px] rounded-full border-[1.5px] bg-gray-200 dark:bg-[#2c2c2f] border-gray-300 dark:border-[#5a5a56] flex items-center justify-center shrink-0">
          <Icon
            size={18}
            strokeWidth={1.75}
            className="text-[#1a1a1a] dark:text-[#e8e8e6]"
          />
        </div>
        <div className="min-w-0">
          <p
            className={`text-sm font-semibold text-[#1a1a1a] dark:text-[#e8e8e6] truncate ${dmSans.className}`}
          >
            {persona.name}
          </p>
          <p
            className={`text-xs text-gray-500 dark:text-[#6f6f6b] mt-0.5 truncate ${dmSans.className}`}
          >
            {title}
          </p>
        </div>
      </div>
      <div className="h-5 bg-gradient-to-b from-white dark:from-[#202023] to-white/0 dark:to-[#202023]/0" />
    </div>
  );
}
