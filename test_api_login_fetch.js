async function testApiLogin() {
    const url = 'http://localhost:3000/api/auth/login';
    const payload = {
        identifier: '11999990001',
        password: 'password123'
    };

    try {
        console.log(`--- Testando login via API em: ${url} ---`);
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data = await response.json();
        if (response.ok) {
            console.log('Login realizado com SUCESSO!');
            console.log('Status:', response.status);
            console.log('Data:', JSON.stringify(data, null, 2).slice(0, 200) + '...');
        } else {
            console.error('FALHA no login via API!');
            console.error('Status:', response.status);
            console.error('Data:', data);
        }
    } catch (error) {
        console.error('ERRO na requisição:', error.message);
    }
}

testApiLogin();
