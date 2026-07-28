"use client";
import { useState } from "react";
import { X } from "lucide-react";
import SettingsNav, { SettingsCategory } from "./SettingsNav";
import GeneralPane from "./panes/GeneralPane";
import PersonaPane from "./panes/PersonaPane";
import AppearancePane from "./panes/AppearancePane";
import NotificationsPane from "./panes/NotificationsPane";
import PrivacyPane from "./panes/PrivacyPane";

const TITLES: Record<SettingsCategory, string> = {
  general: "General",
  persona: "Persona",
  appearance: "Appearance",
  notifications: "Notifications",
  privacy: "Privacy & Data",
};

const PANES: Record<SettingsCategory, React.ReactNode> = {
  general: <GeneralPane />,
  persona: <PersonaPane />,
  appearance: <AppearancePane />,
  notifications: <NotificationsPane />,
  privacy: <PrivacyPane />,
};

export default function SettingsModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [active, setActive] = useState<SettingsCategory>("general");
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
      onClick={onClose}
    >
      <div
        className="flex h-[560px] w-full max-w-[820px] overflow-hidden rounded-xl border border-[#333336] bg-[#1b1b1d] text-[#f2f2f0] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <SettingsNav active={active} onSelect={setActive} />
        <section className="flex flex-1 flex-col">
          <div className="flex items-center justify-between border-b border-[#333336] px-6 py-4">
            <h2 className="text-base font-semibold">{TITLES[active]}</h2>
            <button
              onClick={onClose}
              className="rounded-md p-1 text-[#9a9a9e] hover:bg-[#2c2c2f] hover:text-[#f2f2f0]"
            >
              <X size={18} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-6 py-5">
            {PANES[active]}
          </div>
          <div className="flex justify-end gap-2 border-t border-[#333336] px-6 py-3">
            <button
              onClick={onClose}
              className="rounded-md px-4 py-2 text-sm text-[#9a9a9e] hover:bg-[#2c2c2f]"
            >
              Cancel
            </button>
            <button className="rounded-md bg-[#f2f2f0] px-4 py-2 text-sm font-medium text-[#1b1b1d] hover:bg-white">
              Save changes
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
