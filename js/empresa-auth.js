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

    const vagasAtivas = document.getElementById('vagasAtivas');
    if (vagasAtivas) {
        const vagasAtivasElement = document.getElementById('vagasAtivas');
        async function carregarQtdeVagas() {
           // Dentro da sua função carregarQtdeVagas():
            const codEmpresa = localStorage.getItem('codEmpresa');
            vagasAtivasElement.innerHTML = `
                <span class="loader-inline">
                <span></span><span></span><span></span>
                <style>
                    .loader-inline {
                        display: inline-flex; /* Faz o loader se comportar como o número */
                        gap: 4px;
                        align-items: center;
                        justify-content: center;
                        line-height: 1; 
                        vertical-align: middle;
                    }
                    .loader-inline span {
                        width: 12px;
                        height: 12px;
                        background-color: #ffffff;
                        border-radius: 50%;
                        animation: bouncePixabay 1.3s infinite ease-in-out both;
                    }
                    .loader-inline span:nth-child(1) { animation-delay: -0.30s; }
                    .loader-inline span:nth-child(2) { animation-delay: -0.15s; }

                    @keyframes bouncePixabay {
                        0%, 80%, 100% { transform: translateY(0); }
                        40% { transform: translateY(-12px); } /* Pulo controlado */
                    }
                </style>
            </span>
            `;
            try {
                const response = await fetch(`http://localhost:8080/empresas/contagem/vagas/${codEmpresa}`, {
                    method: 'GET', // Mudamos para GET
                    headers: { 
                        'Authorization': `Bearer ${localStorage.getItem('token')}` 
                    }
                    // NÃO precisa de 'Content-Type' nem de 'body'!
                });

                if (response.ok) {
                    const total = await response.text();
                    document.getElementById('vagasAtivas').innerText = total;
                }
            } catch (error) {
                console.error("Erro no GET:", error);
            }
        }
        carregarQtdeVagas();
    }

    const candidatosTotais = document.getElementById('candidatosTotais');
    if (candidatosTotais) {
        const candidatosTotaisElement = document.getElementById('candidatosTotais');

        async function carregarQtdeCandidatos() {
            const codEmpresa = localStorage.getItem('codEmpresa');
            candidatosTotaisElement.innerHTML = `
                <span class="loader-inline">
                <span></span><span></span><span></span>
                <style>
                    .loader-inline {
                        display: inline-flex;
                        gap: 4px;
                        align-items: center;
                        justify-content: center;
                        line-height: 1; 
                        vertical-align: middle;
                    }
                    .loader-inline span {
                        width: 12px;
                        height: 12px;
                        background-color: #ffffff;
                        border-radius: 50%;
                        animation: bouncePixabay 1.3s infinite ease-in-out both;
                    }
                    .loader-inline span:nth-child(1) { animation-delay: -0.30s; }
                    .loader-inline span:nth-child(2) { animation-delay: -0.15s; }

                    @keyframes bouncePixabay {
                        0%, 80%, 100% { transform: translateY(0); }
                        40% { transform: translateY(-12px); }
                    }
                </style>
            </span>
            `;
            try {
                const response = await fetch(`http://localhost:8080/empresas/contagem/candidaturas/${codEmpresa}`, {
                    method: 'GET',
                    headers: { 
                        'Authorization': `Bearer ${localStorage.getItem('token')}` 
                    }
                });

                if (response.ok) {
                    const total = await response.text();
                    document.getElementById('candidatosTotais').innerText = total;
                }
            } catch (error) {
                console.error("Erro no GET:", error);
            }
        }

        carregarQtdeCandidatos();
    }

    // ----------VAGAS PUBLICADAS ----------
    const listaVagasDiv = document.getElementById('listaVagas');
    let vagas = [];
    let paginaAtual = 0;
    let itensPorPagina = 12;
    let vagaIdSelecionada = null;

    if (listaVagasDiv) {
        async function getVagas() {
            try {
                const codEmpresa = localStorage.getItem('codEmpresa');
                const response = await fetch(`http://localhost:8080/vagas/empresa/${codEmpresa}`, {
                    method: 'GET',
                    headers: { 
                        'Authorization': `Bearer ${localStorage.getItem('token')}` 
                    }
                });

                if (response.ok) {
                    vagas = await response.json();
                    popularAreas();
                    listar();
                } else {
                    console.error('Erro ao obter as vagas.');
                }
            } catch (error) {
                console.error('Erro de conexão:', error);
            }
        }

        async function listar() {
            const grid = document.getElementById('listaVagas');
            grid.innerHTML = "";

            const pesquisa = document.getElementById('inputBusca').value.toLowerCase();
            const areaFiltro = document.getElementById('selectArea').value;

            const filtradas = vagas.filter(v => {
                const matchesTexto = v.titulo.toLowerCase().includes(pesquisa) || 
                                     v.descricao.toLowerCase().includes(pesquisa);
                const matchesArea = areaFiltro === "" || v.area === areaFiltro;
                return matchesTexto && matchesArea;
            });

            const paraExibir = aplicarPaginacao(filtradas);

            paraExibir.forEach(vaga => {
                const col = document.createElement('div');
                console.log(vaga);
                col.classList.add('col-md-12', 'mb-4');
                col.innerHTML = `
                    <div class="vaga-item glass-card p-4 h-100 d-flex flex-column shadow-sm overflow-hidden hover-lift cursor-pointer" onclick='abrirModal(${JSON.stringify(vaga)})'>
                        <h4 class="fw-bold mb-2">${vaga.titulo}</h4>
                        <p class="text-info small mb-2"><i class="bi bi-building me-1"></i>${vaga.empresa.nome}</p>
                        <p class="text-white-50 small flex-grow-1">
                            ${vaga.descricao.substring(0, 80)}... 
                            <span class="text-info fw-bold" style="cursor:pointer" onclick='abrirModal(${JSON.stringify(vaga)})'>Ver mais</span>
                        </p>
                        <div class="mt-3">
                            <span class="badge bg-light text-dark rounded-pill">${vaga.area}</span>
                        </div>
                    </div>
                `;
                grid.appendChild(col);
            });
        }

        function abrirModal(vaga) {
            vagaIdSelecionada = vaga.codVaga;
            document.getElementById('detalheTitulo').innerText = vaga.titulo;
            document.getElementById('detalheEmpresa').innerText = vaga.empresa.nome;
            document.getElementById('detalheArea').innerText = vaga.area;
            document.getElementById('detalheDescricao').innerText = vaga.descricao;

            const modal = new bootstrap.Modal(document.getElementById('modalVaga'));
            modal.show();
        }

        function popularAreas() {
            const sel = document.getElementById('selectArea');
            const areas = [...new Set(vagas.map(v => v.area))];
            areas.forEach(a => {
                const opt = document.createElement('option');
                opt.value = a; opt.textContent = a;
                sel.appendChild(opt);
            });
        }

         function aplicarPaginacao(lista) {
            const total = lista.length;
            const totalPaginas = Math.ceil(total / itensPorPagina) || 1;
            if (paginaAtual >= totalPaginas) paginaAtual = 0;
            const inicio = paginaAtual * itensPorPagina;
            const fim = inicio + itensPorPagina;
            document.getElementById('contadorTopo').textContent = `${Math.min(fim, total)} / ${total} vagas`;
            document.getElementById('numPagina').textContent = `${paginaAtual + 1} de ${totalPaginas}`;
            document.getElementById('btnVoltar').style.display = paginaAtual > 0 ? 'inline-block' : 'none';
            document.getElementById('btnProximo').style.display = fim >= total ? 'none' : 'inline-block';
            return lista.slice(inicio, fim);
        }

        function proximaPagina() { paginaAtual++; listar(); }
        function paginaAnterior() { if(paginaAtual > 0) { paginaAtual--; listar(); } }

        window.onload = getVagas;

    }
    /*

       
        
        
        function logout() {
            localStorage.clear();
            window.location.href = 'index.html';
        }

        

    */
});