"use client";
import { useEffect, useRef, useState } from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import ChatHeader from "../../components/chat/ChatHeader";
import ChatBody, { Message } from "../../components/chat/ChatBody";
import Composer from "../../components/chat/Composer";
import { PERSONAS, PersonaKey } from "../../components/persona/personas";
import { authFetch } from "../../lib/auth";
import { createConversation } from "../../lib/conversations";

interface ConversationSummary {
  id: string;
  title: string;
  persona: { type: string; displayName: string };
  updatedAt: string;
}

export default function ChatPage() {
  const [hasSentMessage, setHasSentMessage] = useState(false);
  const [isCreatingConversation, setIsCreatingConversation] = useState(false);
  const [currentPersona, setCurrentPersona] = useState<PersonaKey>("police");
  const [currentConvoId, setCurrentConvoId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const hasInitialized = useRef(false);
  const emptyConvoIdRef = useRef<string | null>(null);
  const persona = PERSONAS.find((p) => p.key === currentPersona)!;

  const loadConversationList = async () => {
    const res = await authFetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/conversations`,
    );
    if (!res.ok) return [];
    const data = await res.json();
    if (Array.isArray(data)) setConversations(data);
    return Array.isArray(data) ? data : [];
  };

  const isCreatingRef = useRef(false); // synchronous guard, does not wait for re-render

  const startNewConversation = async () => {
    if (isCreatingRef.current) return;

    // Kalau ada conversation kosong yang masih "nganggur", pindah ke situ aja
    if (emptyConvoIdRef.current) {
      setCurrentConvoId(emptyConvoIdRef.current);
      setMessages([{ from: "bot", text: "hey! what's on your mind today?" }]);
      return;
    }

    isCreatingRef.current = true;
    setIsCreatingConversation(true);
    setMessages([{ from: "bot", text: "hey! what's on your mind today?" }]);
    try {
      const conv = await createConversation(persona.key);
      emptyConvoIdRef.current = conv.id;
      setCurrentConvoId(conv.id);
      await loadConversationList();
    } catch (err) {
      console.error("Failed to create conversation", err);
    } finally {
      isCreatingRef.current = false;
      setIsCreatingConversation(false);
    }
  };

  const handleSelectPersona = async (key: PersonaKey) => {
    if (key === currentPersona || isCreatingRef.current) return;

    setCurrentPersona(key);
    const existing = conversations.find((c) => c.persona.type === key);

    if (existing) {
      setCurrentConvoId(existing.id);
    } else {
      isCreatingRef.current = true;
      setIsCreatingConversation(true);
      setMessages([{ from: "bot", text: "hey! what's on your mind today?" }]);
      try {
        const conv = await createConversation(key);
        setCurrentConvoId(conv.id);
        await loadConversationList();
      } catch (err) {
        console.error("Failed to create conversation for persona", err);
      } finally {
        isCreatingRef.current = false;
        setIsCreatingConversation(false);
      }
    }
  };

  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    const init = async () => {
      const existing = await loadConversationList();
      if (existing.length > 0) {
        setCurrentConvoId(existing[0].id);
        setCurrentPersona(existing[0].persona.type as PersonaKey);
      } else {
        await startNewConversation();
      }
    };

    init();
  }, []);

  useEffect(() => {
    if (!currentConvoId) return;
    let cancelled = false;

    const loadMessages = async () => {
      setIsLoadingHistory(true);
      const res = await authFetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/conversations/${currentConvoId}/messages`,
      );
      if (!cancelled) {
        if (res.ok) {
          const data = await res.json();
          if (data.length > 0) {
            setMessages(
              data.map((m: any) => ({
                from: m.sender === "user" ? "user" : "bot",
                text: m.content,
              })),
            );
            if (emptyConvoIdRef.current === currentConvoId) {
              emptyConvoIdRef.current = null;
            }
          } else {
            setMessages([
              { from: "bot", text: "hey! what's on your mind today?" },
            ]);
            emptyConvoIdRef.current = currentConvoId; // TAMBAHIN INI, yang kelewat
          }
        } else {
          console.error("loadMessages failed", res.status, currentConvoId);
        }
        setIsLoadingHistory(false);
      }
    };

    loadMessages();
    return () => {
      cancelled = true;
    };
  }, [currentConvoId]);

  const handleSend = async (text: string) => {
    if (!currentConvoId) return;
    if (emptyConvoIdRef.current === currentConvoId) {
      emptyConvoIdRef.current = null;
    }
    setMessages((prev) => [...prev, { from: "user", text }]);
    setIsLoading(true);
    try {
      const res = await authFetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/conversations/${currentConvoId}/messages`,
        { method: "POST", body: JSON.stringify({ content: text }) },
      );
      if (!res.ok) throw new Error("send failed");
      const reply = await res.json();
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: reply.botMessage.content },
      ]);
      await loadConversationList();
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: "Sorry, something went wrong." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen">
      <Sidebar
        currentPersona={currentPersona}
        onSelectPersona={handleSelectPersona}
        onNewConversation={startNewConversation}
        isCreatingConversation={isCreatingConversation}
        latest={conversations.map((c) => ({
          id: c.id,
          title: c.persona.displayName,
          sub: c.title,
        }))}
        currentConvoId={currentConvoId ?? ""}
        onSelectConvo={setCurrentConvoId}
      />
      <div className="flex-1 flex flex-col">
        <ChatHeader
          persona={persona}
          title={
            conversations.find((c) => c.id === currentConvoId)?.title ??
            persona.sub
          }
        />
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
