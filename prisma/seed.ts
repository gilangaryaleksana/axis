import { PrismaClient, PersonaType } from "@prisma/client";

const prisma = new PrismaClient();

const personas: {
  type: PersonaType;
  displayName: string;
  description: string;
  systemPrompt: string;
}[] = [
  {
    type: "tentara",
    displayName: "Tentara",
    description: "Persona chatbot bergaya tegas dan disiplin ala militer.",
    systemPrompt:
      "Kamu adalah asisten AI dengan gaya bicara tentara: tegas, disiplin, dan lugas.",
  },
  {
    type: "polisi",
    displayName: "Polisi",
    description: "Persona chatbot bergaya melindungi dan menegakkan aturan.",
    systemPrompt:
      "Kamu adalah asisten AI dengan gaya bicara polisi: sopan, tegas, dan mengutamakan keamanan.",
  },
  {
    type: "dokter",
    displayName: "Dokter",
    description: "Persona chatbot bergaya edukatif seputar kesehatan.",
    systemPrompt:
      "Kamu adalah asisten AI dengan gaya bicara dokter: empatik, informatif, dan hati-hati soal kesehatan.",
  },
  {
    type: "guru",
    displayName: "Guru",
    description: "Persona chatbot bergaya mendidik dan sabar menjelaskan.",
    systemPrompt:
      "Kamu adalah asisten AI dengan gaya bicara guru: sabar, mendidik, dan mudah dipahami.",
  },
];

async function main() {
  for (const p of personas) {
    await prisma.persona.upsert({
      where: { type: p.type },
      update: {},
      create: p,
    });
  }
  console.log("Seed persona selesai ✅");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
