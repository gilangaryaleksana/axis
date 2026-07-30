import SettingsRow from "../SettingsRow";
import ToggleSwitch from "../ToggleSwitch";

export default function PrivacyPane() {
  return (
    <div className="space-y-5">
      <SettingsRow
        label="Save chat history"
        desc="Save chat history to your account."
      >
        <ToggleSwitch defaultChecked />
      </SettingsRow>
      <button className="self-start rounded-md border border-red-500/40 px-4 py-2 text-sm text-red-400 hover:bg-red-500/10">
        Delete all chat history
      </button>
    </div>
  );
}