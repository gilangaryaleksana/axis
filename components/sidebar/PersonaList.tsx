import { Persona, PersonaKey } from "../persona/personas";

interface Props {
  personas: Persona[];
  current: PersonaKey;
  collapsed: boolean;
  onSelect: (key: PersonaKey) => void;
}

export default function PersonaList({
  personas,
  current,
  collapsed,
  onSelect,
}: Props) {
  return (
    <div className="flex flex-col gap-1">
      {personas.map((p) => {
        const Icon = p.icon;
        const isActive = current === p.key;

        return (
          <div
            key={p.key}
            onClick={() => onSelect(p.key)}
            className={`flex items-center gap-2 p-1 rounded-lg cursor-pointer ${
              collapsed ? "justify-center" : "hover:bg-[#2c2c2f]"
            } ${!collapsed && isActive ? "bg-[#2c2c2f]" : ""}`}
          >
            <div
              className={`w-7 h-7 rounded-full border border-[#5a5a56] flex items-center justify-center shrink-0 ${
                collapsed && isActive ? "bg-[#2c2c2f]" : "bg-[#2c2c2f]"
              }`}
            >
              <Icon size={13} strokeWidth={1.75} className="text-[#e8e8e6]" />
            </div>
            {!collapsed && <span className="text-xs">{p.name}</span>}
          </div>
        );
      })}
    </div>
  );
}
