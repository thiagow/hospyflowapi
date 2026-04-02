import { PrismaClient } from '@prisma/client';
require('dotenv').config();

const prisma = new PrismaClient();

async function main() {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                mobile: true,
                role: true,
            }
        });

        console.log('--- Usuários Cadastrados ---');
        users.forEach(u => {
            console.log(`[${u.role}] ${u.name} | E: ${u.email} | M: '${u.mobile}'`);
        });
        console.log('----------------------------');

    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
