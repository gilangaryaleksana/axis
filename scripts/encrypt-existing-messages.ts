import { prisma } from "../src/config/prisma";
import { encrypt } from "../src/utils/crypto";

async function main() {
  const messages = await prisma.message.findMany();
  console.log(`Found ${messages.length} messages total.`);

  for (const message of messages) {
    await prisma.message.update({
      where: { id: message.id },
      data: { content: encrypt(message.content) },
    });
  }

  console.log(`Done. Encrypted ${messages.length} messages.`);
}

main()
  .catch((err) => {
    console.error("Migration failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });