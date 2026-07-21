import {
  Siren,
  GraduationCap,
  Stethoscope,
  ShieldCheck,
  LucideIcon,
} from "lucide-react";

export type PersonaKey = "police" | "teacher" | "doctor" | "soldier";

export interface Persona {
  key: PersonaKey;
  name: string;
  sub: string;
  icon: LucideIcon;
}

export const PERSONAS: Persona[] = [
  {
    key: "police",
    name: "Police",
    sub: "File a Police Report Immediately",
    icon: Siren,
  },
  {
    key: "teacher",
    name: "Teacher",
    sub: "Ask Me Anything About Your Studies",
    icon: GraduationCap,
  },
  {
    key: "doctor",
    name: "Doctor",
    sub: "Describe Your Symptoms",
    icon: Stethoscope,
  },
  {
    key: "soldier",
    name: "Soldier",
    sub: "Stay Sharp, Stay Ready",
    icon: ShieldCheck,
  },
];
