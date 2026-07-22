"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../../components/sidebar/Sidebar";
import ChatHeader from "../../components/chat/ChatHeader";
import ChatBody, { Message } from "../../components/chat/ChatBody";
import Composer from "../../components/chat/Composer";
import { PERSONAS, PersonaKey } from "../../components/persona/personas";
import { authFetch, getToken } from "@/lib/auth";

export default function ChatPage() {
  const router = useRouter();
  const [currentPersona, setCurrentPersona] = useState<PersonaKey>("police");
  const [currentConvoId, setCurrentConvoId] = useState(
    "2c0e1e8c-bc2d-4694-aca7-d7cad950d523",
  );
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  const persona = PERSONAS.find((p) => p.key === currentPersona)!;

  const latest = [
    { id: "1", title: persona.name, sub: persona.sub },
    { id: "2", title: persona.name, sub: persona.sub },
  ];

  // Guard: kalau belum ada token, tendang ke halaman login
  useEffect(() => {
    if (!getToken()) {
      router.replace("/");
    }
  }, [router]);

  // Fetch history tiap kali convo aktif berubah
  useEffect(() => {
    if (!currentConvoId) return;

    let cancelled = false;

    const loadMessages = async () => {
      setIsLoadingHistory(true);
      try {
        const res = await authFetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/conversations/${currentConvoId}/messages`,
        );

        if (res.status === 401) {
          router.replace("/");
          return;
        }
        if (!res.ok) throw new Error("Gagal load pesan");

        const data = await res.json();
        if (cancelled) return;

        if (Array.isArray(data) && data.length > 0) {
          setMessages(
            data.map((m: any) => ({
              from: m.sender === "user" ? "user" : "bot",
              text: m.content,
            })),
          );
        } else {
          setMessages([
            { from: "bot", text: "hey! what's on your mind today?" },
          ]);
        }
      } catch (err) {
        console.error(err);
        if (!cancelled) {
          setMessages([
            { from: "bot", text: "hey! what's on your mind today?" },
          ]);
        }
      } finally {
        if (!cancelled) setIsLoadingHistory(false);
      }
    };

    loadMessages();
    return () => {
      cancelled = true;
    };
  }, [currentConvoId, router]);

  const handleSend = async (text: string) => {
    setMessages((prev) => [...prev, { from: "user", text }]);
    setIsLoading(true);

    try {
      const res = await authFetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/conversations/${currentConvoId}/messages`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content: text }),
        },
      );

      if (res.status === 401) {
        router.replace("/");
        return;
      }
      if (!res.ok) throw new Error("Gagal kirim pesan");

      const reply = await res.json();
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: reply.botMessage.content },
      ]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: "Maaf, ada gangguan. Coba lagi ya." },
      ]);
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
          isLoading={isLoading || isLoadingHistory}
        />
        <Composer onSend={handleSend} />
      </div>
    </div>
  );
}
