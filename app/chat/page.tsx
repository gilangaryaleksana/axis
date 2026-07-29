"use client";
import Sidebar from "../../components/sidebar/Sidebar";
import ChatHeader from "../../components/chat/ChatHeader";
import ChatBody from "../../components/chat/ChatBody";
import Composer from "../../components/chat/Composer";
import { useChatConversations } from "../../hooks/useChatConversations";

export default function ChatPage() {
  const {
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
  } = useChatConversations();

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
        onSelectConvo={handleSelectConvo}
      />
      <div className="flex-1 flex flex-col relative overflow-hidden">
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
