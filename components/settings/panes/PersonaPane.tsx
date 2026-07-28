import SettingsRow from "../SettingsRow";
import ToggleSwitch from "../ToggleSwitch";
import { PERSONAS } from "../../persona/personas";

export default function PersonaPane() {
  return (
    <div className="space-y-5">
      <SettingsRow label="Default persona" desc="Persona saat membuka chat baru">
        <select className="w-48 rounded-md border border-[#3a3a3d] bg-[#2c2c2f] px-3 py-1.5 text-sm outline-none focus:border-[#6f8fd8]">
          {PERSONAS.map((p) => (
            <option key={p.key} value={p.key}>
              {p.displayName ?? p.key}
            </option>
          ))}
        </select>
      </SettingsRow>
      <SettingsRow label="Auto-generate chat title" desc="Judul chat dibuat otomatis via Groq">
        <ToggleSwitch defaultChecked />
      </SettingsRow>
    </div>
  );
}