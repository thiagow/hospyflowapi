const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

try {
    const prisma = new PrismaClient();
    console.log('PrismaClient instanciado com sucesso.', prisma);
} catch (error) {
    console.error('Erro ao instanciar PrismaClient:', error.message);
    if (error.clientVersion) console.error('Client Version:', error.clientVersion);
}
