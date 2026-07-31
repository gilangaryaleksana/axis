"use client";
import SettingsRow from "../SettingsRow";
import ToggleSwitch from "../ToggleSwitch";
import { useSettings } from "@/lib/settings-context";

export default function NotificationsPane() {
  const { data, setField, isLoading } = useSettings();

  if (isLoading) {
    return <p className="text-sm text-[#9a9a9e]">Loading...</p>;
  }

  return (
    <div className="space-y-5">
      <SettingsRow
        label="Email notifications"
        desc="Receive notifications via email."
      >
        <ToggleSwitch
          checked={data.emailNotifications}
          onChange={(checked: boolean) =>
            setField("emailNotifications", checked)
          }
        />
      </SettingsRow>
      <SettingsRow
        label="In-app sound"
        desc="Play a sound when a new message arrives."
      >
        <ToggleSwitch
          checked={data.inAppSound}
          onChange={(checked: boolean) => setField("inAppSound", checked)}
        />
      </SettingsRow>
    </div>
  );
}
