const { PrismaClient, UserRole } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('--- Limpando tenantId de usuários SAAS_ADMIN ---');
    
    const result = await prisma.user.updateMany({
        where: {
            role: 'SAAS_ADMIN',
            tenantId: { not: null }
        },
        data: {
            tenantId: null
        }
    });

    console.log(`Sucesso! ${result.count} usuários SaaS Admin foram desconectados de seus tenants.`);
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
