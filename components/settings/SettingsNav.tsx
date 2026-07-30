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
    <aside className="flex w-[200px] flex-shrink-0 flex-col border-r border-gray-200 dark:border-[#333336] bg-white dark:bg-[#202023] p-3">
      <div className="mb-3 px-2 text-sm font-semibold text-[#1a1a1a] dark:text-[#f2f2f0]">
        Settings
      </div>
      <nav className="flex flex-col gap-1">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onSelect(cat.id)}
            className={`flex items-center gap-2 rounded-md px-2 py-2 text-left text-sm ${
              active === cat.id
                ? "bg-gray-100 dark:bg-[#2c2c2f] text-[#1a1a1a] dark:text-[#f2f2f0]"
                : "text-gray-500 dark:text-[#9a9a9e] hover:bg-gray-100 dark:hover:bg-[#2c2c2f] hover:text-black dark:hover:text-[#f2f2f0]"
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