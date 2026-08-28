import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const profiles = await prisma.profile.findMany({
    where: { name: { contains: 'Márcio', mode: 'insensitive' } },
    include: { professional: true }
  });
  console.log(JSON.stringify(profiles, null, 2));
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
