/ --- LÓGICA DE LOGIN CANDIDATO (ATUALIZADA COM TOKEN) ---
const loginForm = document.getElementById('loginForm');

if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        / 1. Captura os valores dos inputs
        const email = document.getElementById('email').value;
        const senha = document.getElementById('senha').value;

        / 2. Feedback visual de carregamento
        const btn = loginForm.querySelector('button');
        const originalText = btn.innerText;
        btn.innerText = 'Autenticando...';
        btn.disabled = true;

        try {
            / 3. Faz a requisição POST enviando JSON no body
            const response = await fetch('https:/talentflow-gfq3.onrender.com/candidatos/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json' 
                },
                body: JSON.stringify({ 
                    email: email, 
                    senha: senha 
                })
            });

            / 4. Verifica se a resposta foi bem-sucedida
            if (response.ok) {
                / O backend retorna um CandidatoLoginResponseDTO (token, nomeCompleto, areaInteresse)
                const data = await response.json();
                
                / Exibe boas-vindas
                alert(`Bem-vindo, ${data.nomeCompleto}!`);
                
                / PERSISTÊNCIA DA SESSÃO:
                / Salvamos o token e os dados básicos separadamente no localStorage
                localStorage.setItem('token', data.token);
                localStorage.setItem('codCandidato', data.codCandidato);
                localStorage.setItem('nomeUsuario', data.nomeCompleto);
                localStorage.setItem('areaUsuario', data.areaInteresse);
                
                / Também salvamos o objeto completo para compatibilidade se necessário
                localStorage.setItem('user', JSON.stringify(data));
                
                / Redireciona para o dashboard
                window.location.href = 'dashboard-candidato.html'; 
            } else {
                / Caso o status seja 401 ou erro de validação
                const errorMsg = await response.text();
                alert(errorMsg || 'E-mail ou senha incorretos.');
            }
        } catch (error) {
            console.error('Erro na requisição:', error);
            alert('Não foi possível conectar ao servidor. Verifique se o backend está rodando.');
        } finally {
            btn.innerText = originalText;
            btn.disabled = false;
        }
    });
}

    / --- LÓGICA DE CADASTRO ---
    const cadastroForm = document.getElementById('cadastroForm');
    if (cadastroForm) {
        cadastroForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            / Montar o Objeto JSON conforme CandidatoRequestDTO.java [cite: 362-363]
            const candidatoDTO = {
                nomeCompleto: document.getElementById('nomeCompleto').value,
                email: document.getElementById('email').value,
                senha: document.getElementById('senha').value,
                areaInteresse: document.getElementById('areaInteresse').value,
                cep: document.getElementById('cep').value,
                cidade: document.getElementById('cidade').value,
                estado: document.getElementById('estado').value,
                rua: document.getElementById('rua').value,
                numero: document.getElementById('numero').value,
                bairro: document.getElementById('bairro').value,
                complemento: document.getElementById('complemento').value
            };

            const btn = cadastroForm.querySelector('button');
            btn.innerText = 'Cadastrando...';
            btn.disabled = true;

            try {
                / Backend espera JSON no Body
                const response = await fetch('https:/talentflow-gfq3.onrender.com/candidatos', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(candidatoDTO)
                });

                if (response.ok) {
                    alert('Cadastro realizado com sucesso! Faça login.');
                    window.location.href = 'candidato-login.html';
                } else {
                    / Tentar ler a mensagem de erro do backend (ex: Email já existe)
                    const errorText = await response.text(); 
                    alert('Erro no cadastro: ' + errorText);
                }
            } catch (error) {
                alert('Erro ao conectar com o servidor.');
                console.error(error);
            } finally {
                btn.innerText = 'Finalizar Cadastro';
                btn.disabled = false;
            }
        });
    }