const axios = require('axios');

async function testApiLogin() {
    const url = 'http://localhost:3000/api/auth/login';
    const payload = {
        identifier: '11999990001',
        password: 'password123'
    };

    try {
        console.log(`--- Testando login via API em: ${url} ---`);
        const response = await axios.post(url, payload);
        console.log('Login realizado com SUCESSO!');
        console.log('Status:', response.status);
        console.log('Data:', JSON.stringify(response.data, null, 2).slice(0, 200) + '...');
    } catch (error) {
        console.error('FALHA no login via API!');
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', error.response.data);
        } else {
            console.error('Erro:', error.message);
        }
    }
}

testApiLogin();
