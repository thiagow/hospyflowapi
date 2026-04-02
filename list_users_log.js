const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const fs = require('fs');

async function listUsers() {
    try {
        const users = await prisma.user.findMany({
            select: { name: true, email: true, mobile: true, whatsapp: true, role: true }
        });
        
        const logContent = users.map(u => 
            `Name: ${u.name} | Email: ${u.email} | Mobile: ${u.mobile} | WhatsApp: ${u.whatsapp} | Role: ${u.role}`
        ).join('\n');
        
        fs.writeFileSync('users_list.log', logContent);
        console.log('User list saved to users_list.log');
    } catch (error) {
        console.error('ERRO:', error.message);
    } finally {
        await prisma.$disconnect();
    }
}

listUsers();
