const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.profile.updateMany({ 
    where: { 
      email: { 
        in: ['marciojunior.prowork@gmail.com', 'maricojunior10@gmail.com'] 
      } 
    }, 
    data: { role: 'ADMIN' } 
  });
  console.log('Promovidos a ADMIN');
}

main().finally(() => prisma.$disconnect());
