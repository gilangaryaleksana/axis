import { User, Sparkles, Palette, Bell, Shield } from "lucide-react";

export type SettingsCategory = "general" | "persona" | "appearance" | "notifications" | "privacy";

const CATEGORIES: { id: SettingsCategory; label: string; icon: React.ReactNode }[] = [
  { id: "general", label: "General", icon: <User size={16} /> },
  { id: "persona", label: "Persona", icon: <Sparkles size={16} /> },
  { id: "appearance", label: "Appearance", icon: <Palette size={16} /> },
  { id: "notifications", label: "Notifications", icon: <Bell size={16} /> },
  { id: "privacy", label: "Privacy & Data", icon: <Shield size={16} /> },
];

export default function SettingsNav({
  active,
  onSelect,
}: {
  active: SettingsCategory;
  onSelect: (c: SettingsCategory) => void;
}) {
  return (
    <aside className="flex w-[200px] flex-shrink-0 flex-col border-r border-[#333336] bg-[#202023] p-3">
      <div className="mb-3 px-2 text-sm font-semibold">Settings</div>
      <nav className="flex flex-col gap-1">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onSelect(cat.id)}
            className={`flex items-center gap-2 rounded-md px-2 py-2 text-left text-sm ${
              active === cat.id ? "bg-[#2c2c2f] text-[#f2f2f0]" : "text-[#9a9a9e] hover:bg-[#2c2c2f] hover:text-[#f2f2f0]"
            }`}
          >
            {cat.icon}
            {cat.label}
          </button>
        ))}
      </nav>
    </aside>
  );
}