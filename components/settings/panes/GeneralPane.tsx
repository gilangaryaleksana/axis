"use client";
import SettingsRow from "../SettingsRow";
import { useSettings } from "../../../lib/settings-context";

export default function GeneralPane() {
  const { data, setField, isLoading } = useSettings();

  if (isLoading) {
    return <p className="text-sm text-[#9a9a9e]">Loading...</p>;
  }

  return (
    <div className="space-y-5">
      <SettingsRow
        label="Display name"
        desc="This name will be displayed in your chats."
      >
        <input
          type="text"
          value={data.displayName}
          onChange={(e) => setField("displayName", e.target.value)}
          className="w-48 rounded-md border border-gray-300 dark:border-[#3a3a3d] bg-white dark:bg-[#2c2c2f] text-[#1a1a1a] dark:text-[#f2f2f0] px-3 py-1.5 text-sm outline-none focus:border-[#6f8fd8]"
        />
      </SettingsRow>
      <SettingsRow label="Language" desc="Default language for AI responses.">
        <select
          value={data.language}
          onChange={(e) => setField("language", e.target.value)}
          className="w-48 rounded-md border border-gray-300 dark:border-[#3a3a3d] bg-white dark:bg-[#2c2c2f] text-[#1a1a1a] dark:text-[#f2f2f0] px-3 py-1.5 text-sm outline-none"
        >
          <option value="en">English</option>
          <option value="id">Bahasa Indonesia</option>
        </select>
      </SettingsRow>
    </div>
  );
}
