"use client";
import { useState } from "react";
import { ArrowRight } from "lucide-react";

export default function Composer({
  onSend,
}: {
  onSend: (text: string) => void;
}) {
  const [value, setValue] = useState("");

  const handleSend = () => {
    if (!value.trim()) return;
    onSend(value.trim());
    setValue("");
  };

  return (
    <div className="px-10 pt-4 pb-2 bg-[#2b2b2b]">
      <div className="flex max-w-3xl mx-auto items-center gap-2.5 bg-[#4d4d4a] rounded-2xl pl-5 pr-2 py-2">
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Write a Message..."
          className="flex-1 bg-transparent outline-none text-[#f4f3f0] placeholder:text-[#c9c8c4] text-[15px]"
        />
        <button
          onClick={handleSend}
          className="w-[42px] h-[42px] rounded-xl bg-[#3d3d3a] hover:bg-[#474743] flex items-center justify-center text-[#f4f3f0] shrink-0"
        >
          <ArrowRight size={18} />
        </button>
      </div>
      <p className="text-center italic text-xs text-[#6f6f6b] pt-1.5">
        AI can make mistakes. It is not a substitute for certified
        professionals.
      </p>
    </div>
  );
}
