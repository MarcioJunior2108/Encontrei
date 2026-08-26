const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function listUsers() {
  try {
    const users = await prisma.profile.findMany({
      select: { email: true, name: true, role: true }
    });
    console.log('Users in DB:');
    users.forEach(u => console.log(`- ${u.email} | ${u.name} | ${u.role}`));
  } catch (error) {
    console.error('Error fetching users:', error);
  } finally {
    await prisma.$disconnect();
  }
}

listUsers();
