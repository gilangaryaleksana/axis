import SettingsRow from "../SettingsRow";
import ToggleSwitch from "../ToggleSwitch";

export default function NotificationsPane() {
  return (
    <div className="space-y-5">
      <SettingsRow
        label="Email notifications"
        desc="Receive notifications via email."
      >
        <ToggleSwitch defaultChecked />
      </SettingsRow>
      <SettingsRow
        label="In-app sound"
        desc="Play a sound when a new message arrives."
      >
        <ToggleSwitch />
      </SettingsRow>
    </div>
  );
}