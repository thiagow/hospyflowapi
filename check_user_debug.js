const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkUser() {
    try {
        console.log('--- Verificando usuário no banco de dados ---');
        const userByMobile = await prisma.user.findFirst({
            where: { mobile: '11999990001' }
        });

        if (userByMobile) {
            console.log('ENCONTRADO por Mobile: 11999990001');
            console.log('ID:', userByMobile.id);
            console.log('Email:', userByMobile.email);
            console.log('Celular (mobile):', userByMobile.mobile);
            console.log('Role:', userByMobile.role);
        } else {
            console.log('NÃO ENCONTRADO por Mobile: 11999990001');
            
            // Tenta ver tudo o que tem lá
            const allUsers = await prisma.user.findMany({
                take: 10,
                select: { name: true, email: true, mobile: true, role: true }
            });
            console.log('Amostra de usuários no banco:', allUsers);
        }
    } catch (error) {
        console.error('ERRO:', error.message);
    } finally {
        await prisma.$disconnect();
    }
}

checkUser();
