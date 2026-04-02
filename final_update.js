const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

async function main() {
  const prisma = new PrismaClient();
  const mobile = '11999990005';
  const newPassword = 'password123';
  
  console.log(`Checking user with mobile: ${mobile}...`);
  
  const user = await prisma.user.findFirst({
    where: { mobile: mobile }
  });

  if (user) {
    console.log(`Found user: ${user.name}. Updating password to ${newPassword}...`);
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword }
    });
    console.log('Password updated successfully!');
  } else {
    console.log('User not found by mobile. Listing all users:');
    const all = await prisma.user.findMany({ select: { name: true, mobile: true } });
    console.log(all);
  }
  
  await prisma.$disconnect();
}

main().catch(console.error);
