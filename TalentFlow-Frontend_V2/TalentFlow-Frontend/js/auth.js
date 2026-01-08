document.addEventListener('DOMContentLoaded', () => {
    
    // --- LÓGICA DE LOGIN ---
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const senha = document.getElementById('senha').value;

            // Feedback visual de carregamento
            const btn = loginForm.querySelector('button');
            const originalText = btn.innerText;
            btn.innerText = 'Autenticando...';
            btn.disabled = true;

            try {
                // Backend usa @RequestParam, então enviamos na URL
                const response = await fetch(`http://localhost:8080/candidatos/login?email=${email}&senha=${senha}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if (response.ok) {
                    const candidato = await response.json();
                    alert(`Bem-vindo, ${candidato.nomeCompleto}!`);
                    
                    // Salvar usuário na sessão (simulação simples)
                    localStorage.setItem('user', JSON.stringify(candidato));
                    
                    // Redirecionar para dashboard ou home
                    window.location.href = 'dashboard-candidato.html'; 
                } else {
                    throw new Error('Credenciais inválidas');
                }
            } catch (error) {
                alert('Erro ao entrar: Verifique seu e-mail e senha.');
                console.error(error);
            } finally {
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
});

// Exemplo de trecho para o login da empresa
const loginEmpresaForm = document.getElementById('loginEmpresaForm');

if (loginEmpresaForm) {
    loginEmpresaForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Pega inputs (adicione IDs no HTML do portal-empresa se não tiver)
        const nome = document.querySelector('input[placeholder="Nome da Empresa"]')?.value || "Empresa Teste"; 
        const cnpj = document.querySelector('input[placeholder="00.000.000/0000-00"]')?.value || "000";

        try {
            // Chama endpoint de Login da Empresa [cite: 777]
            const response = await fetch(`http://localhost:8080/empresas/login?nome=${nome}&cnpj=${cnpj}`, {
                method: 'POST'
            });

            if (response.ok) {
                const empresa = await response.json();
                
                // --- IMPORTANTE: SALVAR NO STORAGE ---
                localStorage.setItem('empresa', JSON.stringify(empresa));
                
                window.location.href = 'dashboard-empresa.html';
            } else {
                alert('Empresa não encontrada.');
            }
        } catch (error) {
            console.error(error);
            // Para testes visuais apenas:
            // localStorage.setItem('empresa', JSON.stringify({codEmpresa: 1, nome: 'Empresa Teste'}));
            // window.location.href = 'dashboard-empresa.html';
        }
    });
}