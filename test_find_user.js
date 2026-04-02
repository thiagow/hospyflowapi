const { PrismaClient } = require('@prisma/client');

async function main() {
  const prisma = new PrismaClient();
  const users = await prisma.user.findMany({
    take: 10
  });
  console.log('TOTAL USERS FOUND:', users.length);
  if (users.length > 0) {
    console.log('SAMPLE USER:', JSON.stringify(users[0], null, 2));
  }
  await prisma.$disconnect();
}

main().catch(console.error);
