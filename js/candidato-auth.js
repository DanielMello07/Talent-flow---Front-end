// --- LÓGICA DE LOGIN CANDIDATO (CORRIGIDA) ---
const loginForm = document.getElementById('loginForm');

if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // 1. Captura os valores dos inputs
        const email = document.getElementById('email').value;
        const senha = document.getElementById('senha').value;

        // 2. Feedback visual de carregamento
        const btn = loginForm.querySelector('button');
        const originalText = btn.innerText;
        btn.innerText = 'Autenticando...';
        btn.disabled = true;

        try {
            // 3. Faz a requisição POST enviando JSON no body
            const response = await fetch('http://localhost:8080/candidatos/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json' // Informa ao Spring que é um JSON
                },
                body: JSON.stringify({ 
                    email: email, 
                    senha: senha 
                })
            });

            // 4. Verifica se a resposta foi bem-sucedida (Status 200)
            if (response.ok) {
                // O backend retorna um CandidatoResponseDTO
                const candidato = await response.json();
                
                // Exibe boas-vindas usando o campo nomeCompleto do DTO
                alert(`Bem-vindo, ${candidato.nomeCompleto}!`);
                
                // Salva o objeto do usuário no localStorage para persistir a sessão
                localStorage.setItem('user', JSON.stringify(candidato));
                
                // Redireciona para o dashboard do candidato
                window.location.href = 'dashboard-candidato.html'; 
            } else {
                // Caso o status seja 401 ou outro erro
                const errorMsg = await response.text();
                alert(errorMsg || 'E-mail ou senha incorretos.');
            }
        } catch (error) {
            console.error('Erro na requisição:', error);
            alert('Não foi possível conectar ao servidor. Tente novamente mais tarde.');
        } finally {
            // 5. Restaura o botão após o término da operação
            btn.innerText = originalText;
            btn.disabled = false;
        }
    });
}

    // --- LÓGICA DE CADASTRO ---
    const cadastroForm = document.getElementById('cadastroForm');
    if (cadastroForm) {
        cadastroForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Montar o Objeto JSON conforme CandidatoRequestDTO.java [cite: 362-363]
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
                // Backend espera JSON no Body
                const response = await fetch('http://localhost:8080/candidatos', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(candidatoDTO)
                });

                if (response.ok) {
                    alert('Cadastro realizado com sucesso! Faça login.');
                    window.location.href = 'login.html';
                } else {
                    // Tentar ler a mensagem de erro do backend (ex: Email já existe)
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