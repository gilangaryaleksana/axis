"use client";
import { useEffect, useRef, useState } from "react";
import { PERSONAS, PersonaKey } from "../components/persona/personas";
import { authFetch } from "../lib/auth";
import { createConversation } from "../lib/conversations";
import { Message } from "../components/chat/ChatBody";

interface ConversationSummary {
  id: string;
  title: string;
  persona: { type: string; displayName: string };
  updatedAt: string;
}

export function useChatConversations() {
  const [isCreatingConversation, setIsCreatingConversation] = useState(false);
  const [currentPersona, setCurrentPersona] = useState<PersonaKey>("police");
  const [currentConvoId, setCurrentConvoId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const hasInitialized = useRef(false);
  const isCreatingRef = useRef(false);
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

  const startNewConversation = async () => {
    if (isCreatingRef.current) return;

    const isCurrentEmpty = messages.length <= 1;
    if (currentConvoId && isCurrentEmpty) return;

    isCreatingRef.current = true;
    setIsCreatingConversation(true);
    setMessages([{ from: "bot", text: "hey! what's on your mind today?" }]);
    try {
      const conv = await createConversation(persona.key);
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

  const handleSelectConvo = (id: string) => {
    const conv = conversations.find((c) => c.id === id);
    if (conv) setCurrentPersona(conv.persona.type as PersonaKey);
    setCurrentConvoId(id);
  };

  const handleSend = async (text: string) => {
    if (!currentConvoId) return;
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

  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;
    (async () => {
      const existing = await loadConversationList();
      if (existing.length > 0) {
        setCurrentConvoId(existing[0].id);
        setCurrentPersona(existing[0].persona.type as PersonaKey);
      } else {
        await startNewConversation();
      }
    })();
  }, []);

  useEffect(() => {
    if (!currentConvoId) return;
    let cancelled = false;
    (async () => {
      setIsLoadingHistory(true);
      const res = await authFetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/conversations/${currentConvoId}/messages`,
      );
      if (!cancelled) {
        if (res.ok) {
          const data = await res.json();
          setMessages(
            data.length > 0
              ? data.map((m: any) => ({
                  from: m.sender === "user" ? "user" : "bot",
                  text: m.content,
                }))
              : [{ from: "bot", text: "hey! what's on your mind today?" }],
          );
        } else {
          console.error("loadMessages failed", res.status, currentConvoId);
        }
        setIsLoadingHistory(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [currentConvoId]);

  return {
    persona,
    currentPersona,
    currentConvoId,
    messages,
    conversations,
    isLoading,
    isLoadingHistory,
    isCreatingConversation,
    startNewConversation,
    handleSelectPersona,
    handleSelectConvo,
    handleSend,
  };
}
