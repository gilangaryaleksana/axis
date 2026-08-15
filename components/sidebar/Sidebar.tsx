"use client";

import { useState, useEffect } from "react";
import { PanelLeft, Plus, Settings } from "lucide-react";
import { PERSONAS, PersonaKey } from "../persona/personas";
import PersonaList from "./PersonaList";
import LatestList from "./LatestList";
import SettingsModal from "../../components/settings/SettingsModal";
import { crimsonText, dmSans } from "@/lib/font";
import { useSettings } from "@/lib/settings-context";

interface SidebarProps {
  currentPersona: PersonaKey;
  onSelectPersona: (key: PersonaKey) => void;
  onNewConversation: () => void;
  isCreatingConversation: boolean;
  latest: { id: string; title: string; sub: string }[];
  currentConvoId: string;
  onSelectConvo: (id: string) => void;
  userName?: string;
  onClose?: () => void;
  onRenameConvo?: (id: string, newTitle: string) => void;
  onToggleUnreadConvo?: (id: string, isUnread: boolean) => void;
  onDeleteConvo?: (id: string) => void;
}

interface MeResponse {
  id: string;
  name: string;
  email: string;
  avatarUrl: string | null;
  role: string;
}

export default function Sidebar({
  currentPersona,
  onSelectPersona,
  onNewConversation,
  latest,
  currentConvoId,
  onSelectConvo,
  userName = "Guest",
  isCreatingConversation = false,
  onClose,
  onRenameConvo,
  onToggleUnreadConvo,
  onDeleteConvo,
}: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [user, setUser] = useState<MeResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { data } = useSettings();

  useEffect(() => {
    async function fetchMe() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`,
          { credentials: "include" },
        );
        if (res.ok) {
          const data = await res.json();
          setUser(data);
        }
      } catch (err) {
        console.error("Failed to fetch user data:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchMe();
  }, []);

  const isLoggedIn = !!user;
  const displayName = isLoggedIn ? user.name : userName;
  const userImage = user?.avatarUrl;
  const [imgError, setImgError] = useState(false);

  return (
    <aside
      className={`flex flex-col h-full bg-white dark:bg-[#202023] border-gray-200 dark:border-[#333336] border-r text-[#1a1a1a] dark:text-[#e8e8e6] transition-all duration-200 w-full ${
        collapsed ? "md:w-[82px] md:px-4 px-[18px]" : "md:w-[280px] px-[18px]"
      } ${data.compactSidebar ? "py-[12px]" : "py-[22px]"}`}
    >
      {/* Header / Logo */}
      <div
        className={`flex items-center mb-6 ${
          collapsed ? "md:justify-center justify-between" : "justify-between"
        }`}
      >
        <span
          className={`group inline-flex items-end text-5xl tracking-wide cursor-default ${crimsonText.className} ${
            collapsed ? "md:hidden" : ""
          }`}
        >
          a
          <span className="relative inline-block h-[1em] mb-[3px] overflow-hidden text-4xl leading-none">
            <span className="absolute inset-0 block translate-y-full transition-transform duration-300 ease-out group-hover:translate-y-0">
              xis
            </span>
            <span className="block transition-transform duration-300 ease-out group-hover:-translate-y-full">
              chat
            </span>
          </span>
        </span>
        <button
          onClick={() => {
            if (
              typeof window !== "undefined" &&
              window.matchMedia("(max-width: 767px)").matches
            ) {
              onClose?.();
            } else {
              setCollapsed(!collapsed);
            }
          }}
          className="w-[38px] h-[38px] rounded-[9px] flex items-center justify-center hover:bg-gray-100 dark:hover:bg-[#2c2c2f] transition-colors"
        >
          <PanelLeft size={18} />
        </button>
      </div>

      {/* Button New Conversation */}
      <button
        onClick={onNewConversation}
        disabled={isCreatingConversation}
        className={`flex items-center gap-2 bg-[#D9D9D9] rounded-full text-[#5A5A5A] mb-6 text-sm px-4 py-2 ${
          isCreatingConversation ? "opacity-50" : ""
        } ${crimsonText.className} ${
          collapsed
            ? "md:justify-center md:w-7 md:h-7 md:px-0 md:py-0 md:mx-auto"
            : ""
        }`}
      >
        <Plus size={14} className="text-[#2a2a28] shrink-0" />
        <span className={collapsed ? "md:hidden" : ""}>
          {isCreatingConversation ? "Creating..." : "New Conversation"}
        </span>
      </button>

      {/* Persona Selection */}
      <p
        className={`text-xs tracking-wider text-gray-500 dark:text-[#9a9a97] mb-3.5 ${dmSans.className} ${
          collapsed ? "md:hidden" : ""
        }`}
      >
        Select Persona
      </p>
      <PersonaList
        personas={PERSONAS}
        current={currentPersona}
        collapsed={collapsed}
        onSelect={onSelectPersona}
        compact={data.compactSidebar}
      />

      {/* History / Latest Conversations */}
      <div
        className={`flex flex-col flex-1 min-h-0 ${collapsed ? "md:hidden" : ""}`}
      >
        <p
          className={`text-xs tracking-wider text-gray-500 dark:text-[#9a9a97] mt-7 mb-3.5 ${dmSans.className}`}
        >
          Latest
        </p>
        <LatestList
          items={latest}
          currentId={currentConvoId}
          onSelect={onSelectConvo}
          compact={data.compactSidebar}
          onRename={onRenameConvo}
          onToggleUnread={onToggleUnreadConvo}
          onDelete={onDeleteConvo}
        />
      </div>

      {/* User Profile Footer */}
      <div
        className={`flex items-center gap-3 pt-4 mt-auto border-t border-gray-200 dark:border-[#444] ${
          collapsed ? "justify-center" : "justify-between"
        }`}
      >
        <div
          className={`flex items-center gap-2 overflow-hidden ${
            collapsed ? "justify-center" : ""
          }`}
        >
          {loading ? (
            <div className="w-[34px] h-[34px] rounded-full bg-gray-300 dark:bg-[#5a5a56] animate-pulse shrink-0" />
          ) : isLoggedIn && userImage && !imgError ? (
            <img
              src={userImage}
              alt={displayName}
              onError={() => setImgError(true)}
              className="w-[34px] h-[34px] rounded-full object-cover shrink-0"
            />
          ) : (
            <div
              className={`w-[34px] h-[34px] shrink-0 rounded-full bg-gray-300 dark:bg-[#5a5a56] flex items-center justify-center text-sm font-semibold ${dmSans.className}`}
            >
              <span>{displayName.charAt(0).toUpperCase()}</span>
            </div>
          )}

          {!loading && (
            <div
              className={`flex flex-col truncate ${collapsed ? "md:hidden" : ""}`}
            >
              <span className="text-sm font-medium text-[#1a1a1a] dark:text-white truncate">
                {displayName}
              </span>
              <span className="text-[10px] text-gray-500 dark:text-gray-400">
                {isLoggedIn ? user.email : "Not logged in"}
              </span>
            </div>
          )}
        </div>

        <Settings
          size={18}
          onClick={() => setIsSettingsOpen(true)}
          className={`cursor-pointer shrink-0 text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors ${
            collapsed ? "md:hidden" : ""
          }`}
        />
      </div>

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onSaved={(saved) => {
          setUser((prev) =>
            prev ? { ...prev, name: saved.displayName } : prev,
          );
        }}
      />
    </aside>
  );
}
