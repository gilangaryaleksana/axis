import { Persona, PersonaKey } from "../persona/personas";

interface Props {
  personas: Persona[];
  current: PersonaKey;
  collapsed: boolean;
  onSelect: (key: PersonaKey) => void;
  compact?: boolean;
}

export default function PersonaList({
  personas,
  current,
  collapsed,
  onSelect,
  compact = false,
}: Props) {
  return (
    <div className={`flex flex-col ${compact ? "gap-0.5" : "gap-1"}`}>
      {personas.map((p) => {
        const Icon = p.icon;
        const isActive = current === p.key;

        return (
          <div
            key={p.key}
            onClick={() => onSelect(p.key)}
            className={`flex items-center gap-2 rounded-lg cursor-pointer ${
              compact ? "p-0.5" : "p-1"
            } ${
              collapsed
                ? "justify-center"
                : "hover:bg-gray-100 dark:hover:bg-[#2c2c2f]"
            } ${!collapsed && isActive ? "bg-gray-100 dark:bg-[#2c2c2f]" : ""}`}
          >
            <div
              className={`${compact ? "w-6 h-6" : "w-7 h-7"} rounded-full border border-gray-300 dark:border-[#5a5a56] flex items-center justify-center shrink-0 ${
                collapsed && isActive
                  ? "bg-gray-200 dark:bg-[#2c2c2f]"
                  : "bg-gray-200 dark:bg-[#2c2c2f]"
              }`}
            >
              <Icon
                size={13}
                strokeWidth={1.75}
                className="text-[#1a1a1a] dark:text-[#e8e8e6]"
              />
            </div>
            {!collapsed && (
              <span className="text-xs text-[#1a1a1a] dark:text-[#e8e8e6]">
                {p.name}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
