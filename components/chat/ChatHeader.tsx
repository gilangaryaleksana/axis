import { Persona } from "../persona/personas";
import { dmSans } from "@/lib/font";

export default function ChatHeader({
  persona,
  title,
}: {
  persona: Persona;
  title: string;
}) {
  const Icon = persona.icon;
  return (
    <div className="absolute top-0 left-0 right-0 z-10">
      <div className="flex items-center gap-3.5 px-8 py-3 bg-white dark:bg-[#202023] backdrop-blur-md">
        <div className="w-[35px] h-[35px] rounded-full border-[1.5px] bg-gray-200 dark:bg-[#2c2c2f] border-gray-300 dark:border-[#5a5a56] flex items-center justify-center">
          <Icon
            size={18}
            strokeWidth={1.75}
            className="text-[#1a1a1a] dark:text-[#e8e8e6]"
          />
        </div>
        <div>
          <p
            className={`text-sm font-semibold text-[#1a1a1a] dark:text-[#e8e8e6] ${dmSans.className}`}
          >
            {persona.name}
          </p>
          <p
            className={`text-xs text-gray-500 dark:text-[#6f6f6b] mt-0.5 ${dmSans.className}`}
          >
            {title}
          </p>
        </div>
      </div>
      <div className="h-5 bg-gradient-to-b from-white dark:from-[#202023] to-white/0 dark:to-[#202023]/0" />{" "}
    </div>
  );
}
