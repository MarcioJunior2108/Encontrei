const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const reqs = await prisma.serviceRequest.findMany({
    select: { id: true, status: true, isUnlocked: true }
  });
  console.log('Requests no banco:', reqs);
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
