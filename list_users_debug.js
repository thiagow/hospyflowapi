const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function listUsers() {
    try {
        console.log('--- Listando todos os usuários ---');
        const users = await prisma.user.findMany({
            select: { name: true, email: true, mobile: true, whatsapp: true, role: true }
        });
        console.table(users);
    } catch (error) {
        console.error('ERRO:', error.message);
    } finally {
        await prisma.$disconnect();
    }
}

listUsers();
