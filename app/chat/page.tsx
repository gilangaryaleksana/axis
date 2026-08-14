"use client";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // mobile sidebar toggle

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
    handleRenameConvo,
    handleToggleUnread,
    handleDeleteConvo,
  } = useChatConversations(
    isSettingsLoading
      ? undefined
      : (settingsData.defaultPersona as PersonaKey) || "police",
    isSettingsLoading ? false : settingsData.inAppSound,
  );

  const activeConvo = conversations.find((c) => c.id === currentConvoId);
  const activeConvoTitle = activeConvo?.title;

  useEffect(() => {
    document.title = activeConvoTitle
      ? `${activeConvoTitle} - Axis`
      : "Chat - Axis";
  }, [activeConvoTitle]);

  // close sidebar automatically when a convo/persona is picked (mobile UX)
  const wrapSelectPersona: typeof handleSelectPersona = async (...args) => {
    await handleSelectPersona(...args);
    setIsSidebarOpen(false);
  };
  const wrapSelectConvo: typeof handleSelectConvo = (...args) => {
    handleSelectConvo(...args);
    setIsSidebarOpen(false);
  };

  return (
    <ThemeApplier>
      <div className="flex h-screen relative overflow-hidden">
        {/* mobile overlay backdrop */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/40 z-30 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
        {/* sidebar: full width overlay on mobile, static/280px on desktop */}
        <div
          className={`fixed md:static top-0 left-0 h-full z-40 transition-transform duration-300 ease-in-out w-full md:w-auto md:transform-none ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0`}
        >
          <Sidebar
            currentPersona={currentPersona}
            onSelectPersona={wrapSelectPersona}
            onNewConversation={() => {
              startNewConversation();
              setIsSidebarOpen(false);
            }}
            isCreatingConversation={isCreatingConversation}
            latest={conversations.map((c) => ({
              id: c.id,
              title: c.persona.displayName,
              sub: c.title,
              isUnread: c.isUnread,
            }))}
            currentConvoId={currentConvoId ?? ""}
            onSelectConvo={wrapSelectConvo}
            onClose={() => setIsSidebarOpen(false)}
            onRenameConvo={handleRenameConvo}
            onToggleUnreadConvo={handleToggleUnread}
            onDeleteConvo={handleDeleteConvo}
          />
        </div>
        <div className="flex-1 flex flex-col relative overflow-hidden w-full">
          <ChatHeader
            persona={persona}
            title={activeConvoTitle ?? persona.sub}
            onMenuClick={() => setIsSidebarOpen((v) => !v)}
            onRename={(newTitle) => {
              if (currentConvoId) handleRenameConvo(currentConvoId, newTitle);
            }}
            isUnread={activeConvo?.isUnread}
            onToggleUnread={(isUnread) => {
              if (currentConvoId) handleToggleUnread(currentConvoId, isUnread);
            }}
            onDelete={() => {
              if (currentConvoId) handleDeleteConvo(currentConvoId);
            }}
          />
          <ChatBody
            messages={messages}
            PersonaIcon={persona.icon}
            isLoading={isLoading || isLoadingHistory}
            currentConvoId={currentConvoId ?? undefined}
          />
          <Composer onSend={handleSend} />
        </div>
      </div>
    </ThemeApplier>
  );
}
