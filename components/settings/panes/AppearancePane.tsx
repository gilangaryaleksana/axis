"use client";
import SettingsRow from "../SettingsRow";
import ToggleSwitch from "../ToggleSwitch";
import { useSettings } from "@/lib/settings-context";

export default function AppearancePane() {
  const { data, setField, isLoading } = useSettings();

  if (isLoading) {
    return <p className="text-sm text-[#9a9a9e]">Loading...</p>;
  }

  return (
    <div className="space-y-5">
      <SettingsRow label="Theme" desc="Choose between light and dark mode.">
        <select
          value={data.theme}
          onChange={(e) => setField("theme", e.target.value)}
          className="w-48 rounded-md border border-gray-300 dark:border-[#3a3a3d] bg-white dark:bg-[#2c2c2f] text-[#1a1a1a] dark:text-[#f2f2f0] px-3 py-1.5 text-sm outline-none focus:border-[#6f8fd8]"
        >
          <option value="dark">Dark</option>
          <option value="light">Light</option>
          <option value="system">System</option>
        </select>
      </SettingsRow>
      <SettingsRow
        label="Compact sidebar"
        desc="Reduce the spacing between sidebar items."
      >
        <ToggleSwitch
          checked={data.compactSidebar}
          onChange={(checked: boolean) => setField("compactSidebar", checked)}
        />
      </SettingsRow>
    </div>
  );
}
