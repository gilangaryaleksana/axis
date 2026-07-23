"use client";
import { useState } from "react";
import Sidebar from "@/components/sidebar/Sidebar";
import ChatHeader from "@/components/chat/ChatHeader";
import ChatBody, { Message } from "@/components/chat/ChatBody";
import Composer from "@/components/chat/Composer";
import { PERSONAS, PersonaKey } from "@/components/persona/personas";

export default function ChatPage() {
  const [currentPersona, setCurrentPersona] = useState<PersonaKey>("police");
  const [currentConvoId, setCurrentConvoId] = useState("1");
  const [messages, setMessages] = useState<Message[]>([
    { from: "bot", text: "hey! what's on your mind today?" },
  ]);

  const persona = PERSONAS.find((p) => p.key === currentPersona)!;

  const latest = [
    { id: "1", title: persona.name, sub: persona.sub },
    { id: "2", title: persona.name, sub: persona.sub },
  ];

  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async (text: string) => {
  setMessages((prev) => [...prev, { from: "user", text }]);
  setIsLoading(true);

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ persona: currentPersona, message: text }),
    });
    const reply = await res.json();
    if (!res.ok) throw new Error(reply?.error || "Gagal menghubungi AI");
    setMessages((prev) => [...prev, { from: "bot", text: reply.text }]);
  } catch (err) {
    console.error(err);
    setMessages((prev) => [...prev, { from: "bot", text: "Maaf, ada error. Coba lagi ya." }]);
  } finally {
    setIsLoading(false);
  }
};

  return (
    <div className="flex h-screen">
      <Sidebar
        currentPersona={currentPersona}
        onSelectPersona={setCurrentPersona}
        onNewConversation={() =>
          setMessages([
            { from: "bot", text: "hey! what's on your mind today?" },
          ])
        }
        latest={latest}
        currentConvoId={currentConvoId}
        onSelectConvo={setCurrentConvoId}
        userName="User"
      />
      <div className="flex-1 flex flex-col">
        <ChatHeader persona={persona} sub={persona.sub} />
        <ChatBody
          messages={messages}
          PersonaIcon={persona.icon}
          isLoading={isLoading}
        />
        <Composer onSend={handleSend} />
      </div>
    </div>
  );
}
