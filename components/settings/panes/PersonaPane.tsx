"use client";
import SettingsRow from "../SettingsRow";
import ToggleSwitch from "../ToggleSwitch";
import { PERSONAS } from "../../persona/personas";
import { useSettings } from "@/lib/settings-context";

export default function PersonaPane() {
  const { data, setField, isLoading } = useSettings();

  if (isLoading) {
    return <p className="text-sm text-[#9a9a9e]">Loading...</p>;
  }

  return (
    <div className="space-y-5">
      <SettingsRow label="Default persona" desc="Persona for New Chats.">
        <select
          value={data.defaultPersona}
          onChange={(e) => setField("defaultPersona", e.target.value)}
          className="w-48 rounded-md border border-gray-300 dark:border-[#3a3a3d] bg-white dark:bg-[#2c2c2f] text-[#1a1a1a] dark:text-[#f2f2f0] px-3 py-1.5 text-sm outline-none capitalize"
        >
          {PERSONAS.map((p) => (
            <option key={p.key} value={p.key}>
              {p.displayName ?? p.key}
            </option>
          ))}
        </select>
      </SettingsRow>
      <SettingsRow
        label="Auto-generate chat title"
        desc="Chat titles are generated automatically by Groq."
      >
        <ToggleSwitch
          checked={data.autoGenerateTitle}
          onChange={(checked: boolean) =>
            setField("autoGenerateTitle", checked)
          }
        />
      </SettingsRow>
    </div>
  );
}
