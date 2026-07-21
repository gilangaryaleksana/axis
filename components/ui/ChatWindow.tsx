"use client";

import { useState } from "react";
import ChatBubble from "./ChatBubble";
import { Reveal } from "../animations/Reveal";

type Message = {
  id: number;
  text: string;
  isUser: boolean;
};

const initialMessages: Message[] = [
  { id: 1, text: "hey! what's on your mind today?", isUser: false },
  {
    id: 2,
    text: "need help brainstorming a name for my project",
    isUser: true,
  },
  {
    id: 3,
    text: "ooh I love this game — tell me the vibe you're going for first",
    isUser: false,
  },
];

export default function ChatWindow() {
  const [messages] = useState<Message[]>(initialMessages);

  return (
    <div className="mx-auto flex h-80 w-full max-w-3xl flex-col rounded-[65px] bg-neutral-100 p-6">
      {/* Area pesan */}
      <div className="flex flex-1 flex-col justify-center gap-5 overflow-y-auto mx-10">
        {messages.map((msg, index) => (
          <Reveal
            key={msg.id}
            direction={msg.isUser ? "right" : "left"}
            delay={index * 250}
          >
            <ChatBubble message={msg.text} isUser={msg.isUser} />
          </Reveal>
        ))}
      </div>
    </div>
  );
}
