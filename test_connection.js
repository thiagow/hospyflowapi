const { Client } = require('pg');
require('dotenv').config();

const client = new Client({
    connectionString: process.env.DATABASE_URL,
});

client.connect()
    .then(() => {
        console.log('Conectado com sucesso ao PostgreSQL via pg driver!');
        client.end();
    })
    .catch(err => {
        console.error('Erro de conexão:', err);
        client.end();
    });
