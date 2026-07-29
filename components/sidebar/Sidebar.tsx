"use client";

import { useState, useEffect } from "react";
import { PanelLeft, Plus, Settings } from "lucide-react";
import { PERSONAS, PersonaKey } from "../persona/personas";
import PersonaList from "./PersonaList";
import LatestList from "./LatestList";
import SettingsModal from "../../components/settings/SettingsModal";
import { crimsonText, dmSans } from "@/lib/font";
import { authFetch, getToken } from "@/lib/auth";

interface SidebarProps {
  currentPersona: PersonaKey;
  onSelectPersona: (key: PersonaKey) => void;
  onNewConversation: () => void;
  isCreatingConversation: boolean;
  latest: { id: string; title: string; sub: string }[];
  currentConvoId: string;
  onSelectConvo: (id: string) => void;
  userName?: string;
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
}: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [user, setUser] = useState<MeResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    async function fetchMe() {
      const token = getToken();
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await authFetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`,
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
      className={`flex flex-col h-full bg-[#202023] border-[#333336] border-r text-[#e8e8e6] transition-all duration-200 ${
        collapsed ? "w-[82px] px-4" : "w-[280px] px-[18px]"
      } py-[22px]`}
    >
      {/* Header / Logo */}
      <div
        className={`flex items-center mb-6 ${
          collapsed ? "justify-center" : "justify-between"
        }`}
      >
        {!collapsed && (
          <span
            className={`font-serif text-4xl tracking-wide ${crimsonText.className}`}
          >
            A<span className="text-2xl">xis</span>
          </span>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-[38px] h-[38px] rounded-[9px] flex items-center justify-center hover:bg-[#2c2c2f] transition-colors"
        >
          <PanelLeft size={18} />
        </button>
      </div>

      {/* Button New Conversation */}
      <button
        onClick={onNewConversation}
        disabled={isCreatingConversation}
        className={`flex items-center gap-2 bg-[#D9D9D9] rounded-full text-[#5A5A5A] mb-6 text-sm ${isCreatingConversation ? "opacity-50" : ""} ${
          crimsonText.className
        } ${collapsed ? "justify-center w-7 h-7 mx-auto" : "px-4 py-2"}`}
      >
        <Plus size={14} className="text-[#2a2a28]" />
        {!collapsed && (
          <span>
            {isCreatingConversation ? "Creating..." : "New Conversation"}
          </span>
        )}
      </button>

      {/* Persona Selection */}
      {!collapsed && (
        <p
          className={`text-xs tracking-wider text-[#9a9a97] mb-3.5 ${dmSans.className}`}
        >
          Select Persona
        </p>
      )}
      <PersonaList
        personas={PERSONAS}
        current={currentPersona}
        collapsed={collapsed}
        onSelect={onSelectPersona}
      />

      {/* History / Latest Conversations */}
      {!collapsed && (
        <>
          <p
            className={`text-xs tracking-wider text-[#9a9a97] mt-7 mb-3.5 ${dmSans.className}`}
          >
            Latest
          </p>
          <LatestList
            items={latest}
            currentId={currentConvoId}
            onSelect={onSelectConvo}
          />
        </>
      )}

      {/* User Profile Footer */}
      <div className="flex items-center justify-between gap-3 pt-4 mt-auto border-t border-[#444]">
        <div className="flex items-center gap-2 overflow-hidden">
          {loading ? (
            <div className="w-[34px] h-[34px] rounded-full bg-[#5a5a56] animate-pulse shrink-0" />
          ) : isLoggedIn && userImage && !imgError ? (
            <img
              src={userImage}
              alt={displayName}
              onError={() => setImgError(true)}
              className="w-[34px] h-[34px] rounded-full object-cover shrink-0"
            />
          ) : (
            <div
              className={`w-[34px] h-[34px] shrink-0 rounded-full bg-[#5a5a56] flex items-center justify-center text-sm font-semibold ${dmSans.className}`}
            >
              <span>{displayName.charAt(0).toUpperCase()}</span>
            </div>
          )}

          {!collapsed && !loading && (
            <div className="flex flex-col truncate">
              <span className="text-sm font-medium text-white truncate">
                {displayName}
              </span>
              <span className="text-[10px] text-gray-400">
                {isLoggedIn ? user.email : "Not logged in"}
              </span>
            </div>
          )}
        </div>

        {!collapsed && (
          <Settings
            size={18}
            onClick={() => setIsSettingsOpen(true)}
            className="cursor-pointer shrink-0 text-gray-400 hover:text-white transition-colors"
          />
        )}
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
