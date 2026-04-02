import { PrismaClient } from '@prisma/client';

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
                tenantId: true
            }
        });

        console.log('--- Usuários Cadastrados ---');
        users.forEach(u => {
            console.log(`[${u.role}] ${u.name} | Email: ${u.email} | Mobile: '${u.mobile}' | Tenant: ${u.tenantId}`);
        });
        console.log('----------------------------');

    } catch (error) {
        console.error('Erro ao listar usuários:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
