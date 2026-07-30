"use client";
import { useState } from "react";
import { X } from "lucide-react";
import SettingsNav, { SettingsCategory } from "./SettingsNav";
import GeneralPane from "./panes/GeneralPane";
import PersonaPane from "./panes/PersonaPane";
import AppearancePane from "./panes/AppearancePane";
import NotificationsPane from "./panes/NotificationsPane";
import PrivacyPane from "./panes/PrivacyPane";
import { SettingsProvider, useSettings } from "@/lib/settings-context";

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

function SettingsModalContent({
  onClose,
  onSaved,
}: {
  onClose: () => void;
  onSaved?: (data: { displayName: string; language: string }) => void;
}) {
  const [active, setActive] = useState<SettingsCategory>("general");
  const [showConfirm, setShowConfirm] = useState(false);
  const { isDirty, isSaving, save, reset, data } = useSettings();

  const requestClose = () => {
    if (isDirty) setShowConfirm(true);
    else onClose();
  };

  const discardAndClose = () => {
    reset();
    setShowConfirm(false);
    onClose();
  };

  const handleSave = async () => {
    const ok = await save();
    if (ok) {
      onSaved?.(data);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="flex h-[560px] w-full max-w-[820px] overflow-hidden rounded-xl border border-gray-200 dark:border-[#333336] bg-white dark:bg-[#1b1b1d] text-[#1a1a1a] dark:text-[#f2f2f0] shadow-2xl">
        <SettingsNav active={active} onSelect={setActive} />
        <section className="flex flex-1 flex-col">
          <div className="flex items-center justify-between border-b border-gray-200 dark:border-[#333336] px-6 py-4">
            <h2 className="text-base font-semibold">{TITLES[active]}</h2>
            <button
              onClick={requestClose}
              className="rounded-md p-1 text-gray-500 dark:text-[#9a9a9e] hover:bg-gray-100 dark:hover:bg-[#2c2c2f] hover:text-black dark:hover:text-[#f2f2f0]"
            >
              <X size={18} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-6 py-5">
            {PANES[active]}
          </div>
          <div className="flex justify-end gap-2 border-t border-gray-200 dark:border-[#333336] px-6 py-3">
            <button
              onClick={requestClose}
              className="rounded-md px-4 py-2 text-sm text-gray-500 dark:text-[#9a9a9e] hover:bg-gray-100 dark:hover:bg-[#2c2c2f]"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!isDirty || isSaving}
              className="rounded-md bg-[#1b1b1d] dark:bg-[#f2f2f0] px-4 py-2 text-sm font-medium text-white dark:text-[#1b1b1d] hover:bg-black dark:hover:bg-white disabled:opacity-50"
            >
              {isSaving ? "Saving..." : "Save changes"}
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
            className="w-full max-w-sm rounded-lg border border-gray-200 dark:border-[#333336] bg-white dark:bg-[#232326] p-5 text-[#1a1a1a] dark:text-[#f2f2f0]"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-sm font-medium">Discard unsaved changes?</p>
            <p className="mt-1 text-xs text-gray-500 dark:text-[#9a9a9e]">
              You have changes that haven&apos;t been saved yet.
            </p>
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setShowConfirm(false)}
                className="rounded-md px-3 py-1.5 text-sm text-gray-500 dark:text-[#9a9a9e] hover:bg-gray-100 dark:hover:bg-[#2c2c2f]"
              >
                Cancel
              </button>
              <button
                onClick={discardAndClose}
                className="rounded-md bg-red-500/90 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-500"
              >
                Discard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function SettingsModal({
  isOpen,
  onClose,
  onSaved,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSaved?: (data: { displayName: string; language: string }) => void;
}) {
  if (!isOpen) return null;
  return <SettingsModalContent onClose={onClose} onSaved={onSaved} />; 
}
