const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function makeAdmin() {
  try {
    const result = await prisma.profile.updateMany({
      where: { 
        email: { 
          in: ['marciojunior.prowork@gmail.com', 'marciooliveirati21@gmail.com'] 
        } 
      },
      data: { role: 'ADMIN' }
    });
    console.log('Success! Users updated:', result);
  } catch (error) {
    console.error('Error updating user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

makeAdmin();
