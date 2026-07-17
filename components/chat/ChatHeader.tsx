import { Persona } from "../persona/personas";
import { dmSans } from "@/lib/font";

export default function ChatHeader({
  persona,
  sub,
}: {
  persona: Persona;
  sub: string;
}) {
  const Icon = persona.icon;
  return (
    <div className="flex items-center gap-3.5 px-8 py-5 bg-[#2b2b2b]">
      <div className="w-[35px] h-[35px] rounded-full border-[1.5px] bg-[#3a3a3a] border-[#5a5a56] flex items-center justify-center">
        <Icon size={18} strokeWidth={1.75} className="text-[#e8e8e6]" />
      </div>
      <div>
        <p className={`text-sm font-semibold text-[#e8e8e6] ${dmSans.className}`}>
          {persona.name}
        </p>
        <p className={`text-xs text-[#6f6f6b] mt-0.5 ${dmSans.className}`}>
          {sub}
        </p>
      </div>
    </div>
  );
}
