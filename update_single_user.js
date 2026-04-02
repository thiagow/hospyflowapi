const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

async function main() {
  const prisma = new PrismaClient();
  const searchMobile1 = '(11) 9999-90005';
  const searchMobile2 = '11999990005';
  
  console.log(`Searching for users with mobile like ${searchMobile1} or ${searchMobile2}...`);
  
  const user = await prisma.user.findFirst({
    where: {
      OR: [
        { mobile: searchMobile1 },
        { mobile: { contains: '9999' } }
      ]
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
    console.log('User not found with those mobile numbers.');
    // List all users to see if we can find them
    const allUsers = await prisma.user.findMany({ select: { name: true, mobile: true } });
    if (allUsers.length > 0) {
      console.log('AVAILABLE USERS:', allUsers);
    } else {
      console.log('No users found in the database.');
    }
  }
  
  await prisma.$disconnect();
}

main().catch(console.error);
