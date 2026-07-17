"use client";
import { useState } from "react";
import { PanelLeft, Plus } from "lucide-react";
import { PERSONAS, PersonaKey } from "../persona/personas";
import PersonaList from "./PersonaList";
import LatestList from "./LatestList";
import { crimsonText } from "@/lib/font";

interface SidebarProps {
  currentPersona: PersonaKey;
  onSelectPersona: (key: PersonaKey) => void;
  onNewConversation: () => void;
  latest: { id: string; title: string; sub: string }[];
  currentConvoId: string;
  onSelectConvo: (id: string) => void;
  userName: string;
}

export default function Sidebar({
  currentPersona,
  onSelectPersona,
  onNewConversation,
  latest,
  currentConvoId,
  onSelectConvo,
  userName,
}: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`flex flex-col h-full bg-[#2b2b2b] text-[#e8e8e6] transition-all duration-200 ${
        collapsed ? "w-[82px] px-4" : "w-[280px] px-[18px]"
      } py-[22px]`}
    >
      <div
        className={`flex items-center mb-6 ${collapsed ? "justify-center" : "justify-between"}`}
      >
        {!collapsed && (
          <span className="font-serif text-2xl tracking-wide">
            A<span className="text-sm">xis</span>
          </span>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-[38px] h-[38px] rounded-[9px] flex items-center justify-center"
        >
          <PanelLeft size={18} />
        </button>
      </div>

      <button
        onClick={onNewConversation}
        className={`flex items-center gap-2 bg-[#D9D9D9] rounded-full text-[#5A5A5A] mb-6 text-sm ${crimsonText.className} ${
          collapsed ? "justify-center w-7 h-7 mx-auto" : "px-4 py-2"
        }`}
      >
        <Plus size={14} className="text-[#2a2a28]" />
        {!collapsed && <span>New Conversation</span>}
      </button>

      {!collapsed && (
        <p className="text-[11px] uppercase tracking-wider text-[#9a9a97] mb-3.5">
          Select Persona
        </p>
      )}
      <PersonaList
        personas={PERSONAS}
        current={currentPersona}
        collapsed={collapsed}
        onSelect={onSelectPersona}
      />

      {!collapsed && (
        <>
          <p className="text-[11px] uppercase tracking-wider text-[#9a9a97] mt-7 mb-3.5">
            Latest
          </p>
          <LatestList
            items={latest}
            currentId={currentConvoId}
            onSelect={onSelectConvo}
          />
        </>
      )}

      <div className="flex items-center gap-3 pt-4 mt-auto border-t border-[#444]">
        <div className="w-[34px] h-[34px] rounded-full bg-[#5a5a56] flex items-center justify-center text-sm font-semibold">
          {userName.charAt(0).toUpperCase()}
        </div>
        {!collapsed && <span className="text-sm">{userName}</span>}
      </div>
    </aside>
  );
}
