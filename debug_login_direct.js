const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

async function debugLogin() {
    const identifier = '11999990001';
    const passwordToTest = 'password123';

    try {
        console.log(`--- Depurando login para: ${identifier} ---`);
        const user = await prisma.user.findFirst({
            where: {
                OR: [
                    { email: identifier },
                    { mobile: identifier }
                ]
            }
        });

        if (!user) {
            console.log('USUÁRIO NÃO ENCONTRADO!');
            return;
        }

        console.log('Usuário encontrado:', user.name);
        console.log('Mobile no banco:', `"${user.mobile}"`);
        console.log('Email no banco:', user.email);
        
        const isMatch = await bcrypt.compare(passwordToTest, user.password);
        console.log(`A senha "${passwordToTest}" combina com o hash?`, isMatch ? 'SIM' : 'NÃO');

    } catch (error) {
        console.error('ERRO:', error.message);
    } finally {
        await prisma.$disconnect();
    }
}

debugLogin();
