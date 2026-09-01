const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.profile.findMany({ select: { id: true, name: true, role: true, email: true } });
  console.log(users);
}
main().finally(() => prisma.$disconnect());
