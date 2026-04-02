const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

async function main() {
  const prisma = new PrismaClient();
  const searchMobilePart = '999990005';
  
  console.log(`Searching for users with mobile like %${searchMobilePart}%...`);
  
  const user = await prisma.user.findFirst({
    where: {
      mobile: {
        contains: searchMobilePart
      }
    }
  });

  if (user) {
    console.log(`User found: ${user.name} (id: ${user.id}, mobile: ${user.mobile})`);
    const hashedPassword = await bcrypt.hash('password123', 10);
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword }
    });
    console.log(`Password updated successfully for ${user.name}!`);
  } else {
    console.log('User not found with that mobile part.');
    const all = await prisma.user.findMany();
    console.log('Total users in DB:', all.length);
  }
  
  await prisma.$disconnect();
}

main().catch(console.error);
