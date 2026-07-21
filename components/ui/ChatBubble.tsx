import { dmSans } from "../../lib/font";

type ChatBubbleProps = {
  message: string;
  isUser: boolean;
};

export default function ChatBubble({ message, isUser }: ChatBubbleProps) {
  return (
    <div
      className={`flex items-end gap-2 ${isUser ? "flex-row-reverse" : "flex-row"}`}
    >
      {/* Avatar */}
      <div
        className={`h-9 w-9 shrink-0 rounded-full ${
          isUser ? "bg-neutral-600" : "bg-neutral-300"
        }`}
      />

      {/* Bubble */}
      <div
        className={`max-w-[75%] translate-y-6 rounded-[50px] px-4 py-2.5 text-sm font-extralight leading-relaxed ${
          isUser
            ? "bg-neutral-700 text-white rounded-tr-none"
            : "bg-neutral-300 text-neutral-900 rounded-tl-none"
        } ${dmSans.className}`}
      >
        {message}
      </div>
    </div>
  );
}
