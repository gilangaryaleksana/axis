import SettingsRow from "../SettingsRow";
import ToggleSwitch from "../ToggleSwitch";

export default function AppearancePane() {
  return (
    <div className="space-y-5">
      <SettingsRow label="Theme" desc="Tampilan gelap atau terang">
        <select className="w-48 rounded-md border border-[#3a3a3d] bg-[#2c2c2f] px-3 py-1.5 text-sm outline-none focus:border-[#6f8fd8]">
          <option>Dark</option>
          <option>Light</option>
          <option>System</option>
        </select>
      </SettingsRow>
      <SettingsRow label="Compact sidebar" desc="Perkecil jarak antar item sidebar">
        <ToggleSwitch />
      </SettingsRow>
    </div>
  );
}