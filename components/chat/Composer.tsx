"use client";
import { useRef, useState } from "react";
import { ArrowRight } from "lucide-react";

export default function Composer({
  onSend,
}: {
  onSend: (text: string) => void;
}) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    if (!value.trim()) return;
    onSend(value.trim());
    setValue("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
    const el = e.target;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const hasValue = value.trim().length > 0;

  return (
    <div className="px-10 pt-4 pb-2 bg-[#2b2b2b]">
      <div className="flex max-w-3xl mx-auto items-end gap-2.5 bg-[#4d4d4a] rounded-2xl pl-5 pr-2 py-2">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Write a Message..."
          rows={1}
          className="flex-1 bg-transparent outline-none resize-none text-[#f4f3f0] placeholder:text-[#c9c8c4] text-[15px] py-2 max-h-[200px] overflow-y-auto chat-scrollbar"
        />
        <button
          onClick={handleSend}
          disabled={!hasValue}
          className={`w-[42px] h-[42px] rounded-xl flex items-center justify-center shrink-0 transition-colors ${
            hasValue
              ? "bg-[#f4f3f0] text-[#2b2b2b] hover:bg-[#e0dfda]"
              : "bg-[#3d3d3a] text-[#6f6f6b] "
          }`}
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
