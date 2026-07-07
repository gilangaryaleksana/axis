import { Siren, GraduationCap, Stethoscope, Shield } from "lucide-react";

const personas = [
  { icon: Siren, label: "Police", desc: "witty study buddy" },
  {
    icon: GraduationCap,
    label: "Teacher",
    desc: "curious mind, endless questions",
  },
  {
    icon: Stethoscope,
    label: "Doctor",
    desc: "calm, thoughtful, always listening",
  },
  { icon: Shield, label: "Soldier", desc: "direct, sharp, no fluff" },
];

export default function PersonasGrid() {
  return (
    <div className="grid grid-cols-4 gap-12 justify-center items-start w-6xl mx-auto">
      {personas.map(({ icon: Icon, label, desc }) => (
        <div
          key={label}
          className="flex flex-col items-center text-center gap-3"
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-full border border-neutral-300">
            <Icon className="h-6 w-6 text-neutral-800" strokeWidth={1.5} />
          </div>
          <div>
            <p className="text-base text-neutral-900">{label}</p>
            <p className="text-sm text-neutral-500">&quot;{desc}&quot;</p>
          </div>
        </div>
      ))}
    </div>
  );
}
