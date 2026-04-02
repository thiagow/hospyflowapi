import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

async function main() {
  const prisma = new PrismaClient();
  const users = await prisma.user.findMany();
  console.log(`Found users: ${users.length}`);
  
  const hashedPassword = await bcrypt.hash('123456', 10);
  let updated = 0;
  
  for (const user of users) {
    if (user.role !== 'GUEST') {
      await prisma.user.update({
        where: { id: user.id },
        data: { password: hashedPassword }
      });
      updated++;
    }
  }
  
  console.log(`Updated ${updated} non-guest users to password 123456`);
  await prisma.$disconnect();
}

main().catch(console.error);
