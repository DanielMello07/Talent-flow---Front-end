document.addEventListener('DOMContentLoaded', () => {
    
    // --- LÓGICA DE LOGIN EMPRESA ---
    const loginEmpresaForm = document.getElementById('loginEmpresaForm');

    if (loginEmpresaForm) {
        loginEmpresaForm.addEventListener('submit', async (e) => {
            e.preventDefault(); 
            
            // Pega inputs (usando IDs que adicionamos no HTML)
            const email = document.getElementById('loginEmail').value; 
            const senha = document.getElementById('loginSenha').value;

            const btn = loginEmpresaForm.querySelector('button');
            const textoOriginal = btn.innerText;
            btn.innerText = 'Entrando...';
            btn.disabled = true;

            try {
                // 1. Mudamos a URL para ser limpa
                // 2. Adicionamos Headers informando que estamos enviando JSON
                // 3. Enviamos os dados no 'body' como string JSON
                const response = await fetch('http://localhost:8080/empresas/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json' // Essencial para o @RequestBody do Java
                    },
                    body: JSON.stringify({ 
                        emailCorporativo: email, 
                        senha: senha 
                    })
                });

                if (response.ok) {
                    const empresa = await response.json();
                    
                    localStorage.setItem('empresa', JSON.stringify(empresa));
                    localStorage.setItem('token', empresa.token);
                    localStorage.setItem('codEmpresa', empresa.codEmpresa);
                    localStorage.setItem('user', JSON.stringify(empresa));

                    window.location.href = 'dashboard-empresa.html';
                } else {
                    alert('E-mail ou senha inválidos.');
                }
            } catch (error) {
                console.error(error);
                alert('Erro de conexão com o servidor.');
            }
            finally {
                btn.innerText = textoOriginal;
                btn.disabled = false;
            }
        });
    }

    // --- LÓGICA DE CADASTRO EMPRESA ---
    const cadastroEmpresaForm = document.getElementById('cadastroEmpresaForm');
    
    if (cadastroEmpresaForm) {
        cadastroEmpresaForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const empresaDTO = {
                nome: document.getElementById('cadastroNome').value,
                cnpj: document.getElementById('cadastroCnpj').value,
                descricao: document.getElementById('cadastroDescricao').value,
                contatoRecrutador: document.getElementById('cadastroContato').value,
                emailCorporativo: document.getElementById('cadastroEmail').value,
                senha: document.getElementById('cadastroSenha').value
            };
            
            const btn = cadastroEmpresaForm.querySelector('button');
            const textoOriginal = btn.innerText;
            btn.innerText = 'Cadastrando...';
            btn.disabled = true;

            try {
                const response = await fetch('http://localhost:8080/empresas', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(empresaDTO)
                });

                if (response.ok) {
                    alert('Empresa cadastrada com sucesso! Faça login.');
                    window.location.reload(); 
                } else {
                    alert('Erro ao cadastrar empresa.');
                }
            } catch (error) {
                console.error(error);
                alert('Erro de conexão.');
            } finally {
                btn.innerText = textoOriginal;
                btn.disabled = false;
            }
        });
    }

    // --- LÓGICA DE PUBLICAÇÃO DE VAGA ---

    const publicarVagaForm = document.getElementById('formPublicarVaga');

    if (publicarVagaForm) {
        publicarVagaForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const vagaDTO = {
                titulo: document.getElementById('vagaTitulo').value,
                descricao: document.getElementById('vagaDescricao').value,
                area: document.getElementById('vagaArea').value,
                codEmpresa: localStorage.getItem('codEmpresa')
            };
            const btn = publicarVagaForm.querySelector('#btnPublicar');
            const textoOriginal = btn.innerText;
            btn.innerText = 'Publicando...';
            btn.disabled = true;
            try {
                const response = await fetch(`http://localhost:8080/vagas`, {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}` 
                    },
                    body: JSON.stringify(vagaDTO)
                });
                if (response.ok) {
                    alert('Vaga publicada com sucesso!');
                    window.location.reload();
                } else {
                    alert('Erro ao publicar vaga.');
                }
            } catch (error) {
                console.error(error);
                alert('Erro de conexão.');
            } finally {
                btn.innerText = textoOriginal;
                btn.disabled = false;
            }   
        });
    }
});