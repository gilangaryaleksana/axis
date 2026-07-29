"use client";
import { useState } from "react";
import { X } from "lucide-react";
import { dmSans } from "../../lib/font";
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

export default function SettingsModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [active, setActive] = useState<SettingsCategory>("general");
  const [isDirty, setIsDirty] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  if (!isOpen) return null;

  const PANES: Record<SettingsCategory, React.ReactNode> = {
    general: <GeneralPane onDirty={() => setIsDirty(true)} />,
    persona: <PersonaPane onDirty={() => setIsDirty(true)} />,
    appearance: <AppearancePane onDirty={() => setIsDirty(true)} />,
    notifications: <NotificationsPane onDirty={() => setIsDirty(true)} />,
    privacy: <PrivacyPane onDirty={() => setIsDirty(true)} />,
  };

  const requestClose = () => {
    if (isDirty) {
      setShowConfirm(true);
    } else {
      onClose();
    }
  };

  const discardAndClose = () => {
    setIsDirty(false);
    setShowConfirm(false);
    onClose();
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black/60 ${dmSans.className}`}>
      <div className="flex h-[560px] w-full max-w-[820px] overflow-hidden rounded-xl border border-[#333336] bg-[#1b1b1d] text-[#f2f2f0] shadow-2xl">
        <SettingsNav active={active} onSelect={setActive} />
        <section className="flex flex-1 flex-col">
          <div className="flex items-center justify-between border-b border-[#333336] px-6 py-4">
            <h2 className="text-base font-semibold">{TITLES[active]}</h2>
            <button
              onClick={requestClose}
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
              onClick={requestClose}
              className="rounded-md px-4 py-2 text-sm text-[#9a9a9e] hover:bg-[#2c2c2f]"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                setIsDirty(false);
                onClose();
              }}
              className="rounded-md bg-[#f2f2f0] px-4 py-2 text-sm font-medium text-[#1b1b1d] hover:bg-white"
            >
              Save changes
            </button>
          </div>
        </section>
      </div>

      {showConfirm && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70"
          onClick={() => setShowConfirm(false)}
        >
          <div
            className="w-full max-w-sm rounded-lg border border-[#333336] bg-[#232326] p-5 text-[#f2f2f0]"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-sm font-medium">
              Buang perubahan yang belum disimpan?
            </p>
            <p className="mt-1 text-xs text-[#9a9a9e]">
              Perubahan yang kamu buat belum disimpan.
            </p>
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setShowConfirm(false)}
                className="rounded-md px-3 py-1.5 text-sm text-[#9a9a9e] hover:bg-[#2c2c2f]"
              >
                Batal
              </button>
              <button
                onClick={discardAndClose}
                className="rounded-md bg-red-500/90 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-500"
              >
                Buang
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
