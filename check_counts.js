const { PrismaClient } = require('@prisma/client');

async function main() {
  const prisma = new PrismaClient();
  const models = ['User', 'Tenant', 'Room', 'Task'];
  
  for (const model of models) {
    const count = await prisma[model.toLowerCase()].count();
    console.log(`${model} count: ${count}`);
  }
  
  const allUsers = await prisma.user.findMany();
  console.log('All Users:', allUsers);
  
  await prisma.$disconnect();
}

main().catch(console.error);
