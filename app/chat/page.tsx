"use client";
import { useEffect } from "react"; // tambahin useEffect
import Sidebar from "../../components/sidebar/Sidebar";
import ChatHeader from "../../components/chat/ChatHeader";
import ChatBody from "../../components/chat/ChatBody";
import Composer from "../../components/chat/Composer";
import { PersonaKey } from "../../components/persona/personas";
import ThemeApplier from "../../components/theme/ThemeApplier";
import { useChatConversations } from "../../hooks/useChatConversations";
import { useSettings } from "@/lib/settings-context";

export default function ChatPage() {
  const { data: settingsData, isLoading: isSettingsLoading } = useSettings();

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
  } = useChatConversations(
    isSettingsLoading
      ? undefined
      : (settingsData.defaultPersona as PersonaKey) || "police",
    isSettingsLoading ? false : settingsData.inAppSound,
  );

  const activeConvoTitle = conversations.find(
    (c) => c.id === currentConvoId,
  )?.title;

  useEffect(() => {
    document.title = activeConvoTitle
      ? `${activeConvoTitle} - Axis`
      : "Chat - Axis";
  }, [activeConvoTitle]);

  return (
    <ThemeApplier>
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
            title={activeConvoTitle ?? persona.sub}
          />
          <ChatBody
            messages={messages}
            PersonaIcon={persona.icon}
            isLoading={isLoading || isLoadingHistory}
          />
          <Composer onSend={handleSend} />
        </div>
      </div>
    </ThemeApplier>
  );
}
