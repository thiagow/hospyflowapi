const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('--- Diagnóstico de Usuários e Tenants ---');
    const users = await prisma.user.findMany({
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            tenantId: true,
            tenant: {
                select: {
                    name: true
                }
            }
        }
    });

    users.forEach(u => {
        console.log(`ID: ${u.id} | Nome: ${u.name} | Email: ${u.email} | Role: ${u.role} | TenantID: ${u.tenantId || 'GLOBAL'} | Hotel: ${u.tenant?.name || 'N/A'}`);
    });
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
