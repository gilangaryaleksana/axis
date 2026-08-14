"use client";
import { useEffect, useRef, useState } from "react";
import { PERSONAS, PersonaKey } from "../components/persona/personas";
import { authFetch } from "../lib/auth";
import { Message } from "../components/chat/ChatBody";
import {
  createConversation,
  sendMessage,
  renameConversation,
  markConversationUnread,
  deleteConversationById,
} from "../lib/conversations";

interface ConversationSummary {
  id: string;
  title: string;
  persona: { type: string; displayName: string };
  updatedAt: string;
  isUnread?: boolean;
  _count: { messages: number };
}

const isEmptyConvo = (c: ConversationSummary) => c._count.messages === 0;

export function useChatConversations(
  defaultPersona?: PersonaKey,
  inAppSound?: boolean,
) {
  const [isCreatingConversation, setIsCreatingConversation] = useState(false);
  const [currentPersona, setCurrentPersona] = useState<PersonaKey>(
    defaultPersona ?? "police",
  );
  const [currentConvoId, setCurrentConvoId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const hasInitialized = useRef(false);
  const isCreatingRef = useRef(false);
  const isSwitchingRef = useRef(false);
  const persona = PERSONAS.find((p) => p.key === currentPersona)!;

  const playNotificationSound = () => {
    const audio = new Audio("/sounds/mixkit-message-pop-alert-2354.mp3");
    audio.volume = 0.5;
    audio.play().catch(() => {});
  };

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
    if (isCreatingRef.current || isSwitchingRef.current) return;

    const emptyForCurrentPersona = conversations.find(
      (c) => c.persona.type === currentPersona && isEmptyConvo(c),
    );
    if (emptyForCurrentPersona) {
      if (emptyForCurrentPersona.id !== currentConvoId) {
        isSwitchingRef.current = true;
        setCurrentConvoId(emptyForCurrentPersona.id);
      }
      return;
    }

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

    const emptyExisting = conversations.find(
      (c) => c.persona.type === key && isEmptyConvo(c),
    );
    const existing =
      emptyExisting ?? conversations.find((c) => c.persona.type === key);

    if (existing) {
      isSwitchingRef.current = true;
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
  if (conv?.isUnread) {
    markConversationUnread(id, false).then(loadConversationList);
  }
  isSwitchingRef.current = true;
  setCurrentConvoId(id);
};

  const handleRenameConvo = async (id: string, newTitle: string) => {
    try {
      await renameConversation(id, newTitle);
      await loadConversationList();
    } catch (err) {
      console.error("Failed to rename conversation", err);
    }
  };

  const handleToggleUnread = async (id: string, isUnread: boolean) => {
    try {
      await markConversationUnread(id, isUnread);
      await loadConversationList();
    } catch (err) {
      console.error("Failed to toggle unread status", err);
    }
  };

  const handleDeleteConvo = async (id: string) => {
    try {
      await deleteConversationById(id);
      if (id === currentConvoId) {
        setCurrentConvoId(null);
        setMessages([]);
      }
      await loadConversationList();
    } catch (err) {
      console.error("Failed to delete conversation", err);
    }
  };

  const handleSend = async (text: string) => {
    if (!currentConvoId) return;
    setMessages((prev) => [...prev, { from: "user", text }]);
    setIsLoading(true);
    try {
      const reply = await sendMessage(currentConvoId, text);
      setMessages((prev) => [
        ...prev,
        {
          from: "bot",
          text: reply.botMessage.content,
          type: reply.botMessage.type,
          id: reply.botMessage.id,
        },
      ]);
      if (inAppSound) {
        playNotificationSound();
      }
      await loadConversationList();
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: "Sorry, something went wrong.", type: "text" },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (hasInitialized.current) return;
    if (defaultPersona === undefined) return;
    hasInitialized.current = true;
    (async () => {
      const existing = await loadConversationList();
      if (existing.length > 0) {
        setCurrentConvoId(existing[0].id);
        setCurrentPersona(existing[0].persona.type as PersonaKey);
      } else {
        setCurrentPersona(defaultPersona);
        setIsCreatingConversation(true);
        setMessages([{ from: "bot", text: "hey! what's on your mind today?" }]);
        try {
          const conv = await createConversation(defaultPersona);
          setCurrentConvoId(conv.id);
          await loadConversationList();
        } catch (err) {
          console.error("Failed to create conversation", err);
        } finally {
          setIsCreatingConversation(false);
        }
      }
    })();
  }, [defaultPersona]);

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
                  type: m.type,
                  id: m.id,
                }))
              : [{ from: "bot", text: "hey! what's on your mind today?" }],
          );
        } else {
          console.error("loadMessages failed", res.status, currentConvoId);
        }
        setIsLoadingHistory(false);
        isSwitchingRef.current = false;
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
    handleRenameConvo,
    handleToggleUnread,
    handleDeleteConvo,
  };
}
