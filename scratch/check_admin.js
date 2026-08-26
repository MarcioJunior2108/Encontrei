const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkAdmin() {
  const email = 'marciojunior.prowork@gmail.com';
  try {
    const user = await prisma.profile.findUnique({
      where: { email }
    });
    console.log('User profile:', user);
  } catch (error) {
    console.error('Error fetching user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkAdmin();
