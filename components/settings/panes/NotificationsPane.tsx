import SettingsRow from "../SettingsRow";
import ToggleSwitch from "../ToggleSwitch";

export default function NotificationsPane() {
  return (
    <div className="space-y-5">
      <SettingsRow label="Email notifications" desc="Dapat notifikasi lewat email">
        <ToggleSwitch defaultChecked />
      </SettingsRow>
      <SettingsRow label="In-app sound" desc="Bunyi saat pesan baru masuk">
        <ToggleSwitch />
      </SettingsRow>
    </div>
  );
}