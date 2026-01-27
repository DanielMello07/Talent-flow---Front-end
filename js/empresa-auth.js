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
    
    // Variáveis de estado (precisam estar aqui para serem acessadas pelas funções abaixo)
    window.vagas = [];
    window.paginaAtual = 0;
    window.itensPorPagina = 5;
    window.candidaturasVaga = {};
    window.ordemCrescente = true;

    if (listaVagasDiv) {
        
        // 1. Função para Buscar Vagas (Inicia tudo)
        async function getVagas() {
            try {
                const codEmpresa = localStorage.getItem('codEmpresa');
                if(!codEmpresa) return;

                const response = await fetch(`http://localhost:8080/vagas/empresa/${codEmpresa}`, {
                    method: 'GET',
                    headers: { 
                        'Authorization': `Bearer ${localStorage.getItem('token')}` 
                    }
                });

                if (response.ok) {
                    vagas = await response.json();
                    popularAreas(); // Preenche o select de áreas
                    contarCandidaturas(); // Chama a primeira listagem
                } else {
                    console.error('Erro ao obter as vagas.');
                }
            } catch (error) {
                console.error('Erro de conexão:', error);
            }
        }

        // 2. Função de Listagem (Filtra e manda paginar) - AGORA É GLOBAL (window.)
        window.listar = function() {
            const grid = document.getElementById('listaVagas');
            if(!grid) return;
            grid.innerHTML = "";

            // 1. Pega valores de TODOS os inputs de filtro
            const termo = document.getElementById('inputBusca').value.toLowerCase();
            const areaSelecionada = document.getElementById('selectArea').value;
            const statusSelecionado = document.getElementById('selectAtiva').value; // Novo filtro
            const ordemSelecionada = document.getElementById('selectOrdem').value;

            // 2. Filtra a lista completa SEM sobrescrever a original (vagas)
            const filtradas = vagas.filter(v => {
                const titulo = v.titulo ? v.titulo.toLowerCase() : "";
                const desc = v.descricao ? v.descricao.toLowerCase() : "";
                const area = v.area ? v.area : "";
                const statusSelecionado = document.getElementById('selectAtiva').value;
                
                
                // Lógica do match de texto e área
                const matchTexto = titulo.includes(termo) || desc.includes(termo);
                const matchArea = areaSelecionada === "" || area === areaSelecionada;

                // NOVA Lógica do match de Status (Ativa/Encerrada)
                let matchStatus = true;
                if (statusSelecionado === 'true') {
                    matchStatus = v.ativa === true;
                } else if (statusSelecionado === 'false') {
                    matchStatus = v.ativa === false;
                }

                return matchTexto && matchArea && matchStatus;
            });

            // --- ORDENAÇÃO CORRIGIDA COM INVERSÃO ---
            if (ordemSelecionada === 'nome') {
                filtradas.sort((a, b) => {
                    const titleA = (a.titulo || "").toLowerCase();
                    const titleB = (b.titulo || "").toLowerCase();
                    
                    // Se ordemCrescente for true: A -> Z. Se false: Z -> A
                    return window.ordemCrescente 
                        ? titleA.localeCompare(titleB) 
                        : titleB.localeCompare(titleA);
                });
            } 
            else if (ordemSelecionada === 'candidaturas') {
                filtradas.sort((a, b) => {
                    const qtdeA = window.candidaturasVaga[a.codVaga] || 0;
                    const qtdeB = window.candidaturasVaga[b.codVaga] || 0;
                    
                    // Se ordemCrescente for true: Mais candidatos primeiro (B - A)
                    // Se ordemCrescente for false: Menos candidatos primeiro (A - B)
                    return window.ordemCrescente 
                        ? qtdeB - qtdeA 
                        : qtdeA - qtdeB;
                });
            }

            // 3. Aplica paginação nos itens filtrados
            const paraExibir = aplicarPaginacao(filtradas);

            // ... restante do código de renderização (o seu paraExibir.forEach...)
            if (paraExibir.length === 0) {
                grid.innerHTML = '<div class="col-12 text-center text-white-50 mt-5">Nenhuma vaga encontrada.</div>';
                return;
            }

            paraExibir.forEach(vaga => {
                // ... seu código de criar as colunas e o card ...
                // DICA: Você pode mudar a cor do badge se a vaga estiver encerrada
                

                const badgeClass = vaga.ativa ? 'bg-light text-dark' : 'bg-danger text-white';
                const statusTexto = vaga.ativa ? vaga.area : 'ENCERRADA';

                const col = document.createElement('div');
                col.classList.add('col-md-12', 'mb-4');
                const vagaString = JSON.stringify(vaga).replace(/"/g, '&quot;');

                col.innerHTML = `
                    <div class="vaga-item glass-card p-4 h-100 d-flex fade-in-up flex-column shadow-sm overflow-hidden hover-lift cursor-pointer ${vaga.ativa ? '' : 'opacity-75'}" onclick="window.abrirModal(${vagaString})">
                        <h5 class="fw-bold mb-2 text-truncate">${vaga.titulo} ${vaga.ativa ? '' : '<span class="badge bg-secondary">Encerrada</span>'}</h5>
                        <p class="text-info small mb-2"><i class="bi bi-building me-1"></i>${vaga.empresa ? vaga.empresa.nome : 'Empresa'}</p>
                        <p class="text-white-50 small flex-grow-1">
                            ${vaga.descricao ? vaga.descricao.substring(0, 60) : '...<br/><span class="text-info fw-bold">Ver</span>'} 
                            
                        </p>
                        <div class="mt-2">
                            <span class="badge ${badgeClass} rounded-pill area-tag-clicavel" onclick="filtroAreaTag(event, '${vaga.area}')">${statusTexto}</span>
                        </div>
                    </div>
                `;
                grid.appendChild(col);
            });
        };

        window.inverterOrdem = function(event) {
            if (event) event.preventDefault();
            window.ordemCrescente = !window.ordemCrescente;

            // Opcional: Rotacionar o ícone visualmente para dar feedback ao usuário
            const icone = document.querySelector('.bi-arrow-down-up');
    
            if (icone) {
                // 1. Forçamos o ícone a aceitar transformações
                icone.style.display = 'inline-block'; 
                
                // 2. Se for falso, escala -1 (vira de ponta cabeça)
                // Se for verdadeiro, escala 1 (volta ao normal)
                icone.style.transform = window.ordemCrescente ? 'scaleY(1)' : 'scaleY(-1)';
                
                // 3. Suaviza o movimento
                icone.style.transition = 'transform 0.001s ease-in-out';
            }

            window.listar();
        };

        async function contarCandidaturas() {
            console.log("Iniciando contagem de candidaturas...");

            const promises = vagas.map(async (vaga) => {
                try {
                    const response = await fetch(`http://localhost:8080/candidato-vaga/candidaturas/${vaga.codVaga}`, {
                        method: 'GET',
                        headers: { 
                            'Authorization': `Bearer ${localStorage.getItem('token')}` 
                        }
                    });

                    if (response.ok) {
                        const total = await response.json();
                        
                        // Guarda no dicionário: Chave = ID da Vaga, Valor = Quantidade
                        window.candidaturasVaga[vaga.codVaga] = parseInt(total);
                        
                        console.log(`Vaga ${vaga.codVaga}: ${total} candidaturas carregadas.`);
                    }
                } catch (error) {
                    console.error(`Erro ao contar candidatos da vaga ${vaga.codVaga}:`, error);
                    window.candidaturasVaga[vaga.codVaga] = 0;
                }
            });

            // Espera todas as promessas do map terminarem
            await Promise.all(promises);

            console.log("Dicionário completo carregado:", window.candidaturasVaga);
            
            // Agora que o dicionário está cheio, lista e ordena
            window.listar(); 
        }
        // 3. Lógica de Paginação (Controla números e botões)
        function aplicarPaginacao(lista) {
            const total = lista.length;
            const totalPaginas = Math.ceil(total / itensPorPagina) || 1;

            // Se a busca mudou e estamos numa página que não existe mais, volta pra 0
            if (paginaAtual >= totalPaginas) paginaAtual = 0;

            const inicio = paginaAtual * itensPorPagina;
            const fim = inicio + itensPorPagina;

            // Atualiza Textos
            const contador = document.getElementById('contadorTopo');
            const numPag = document.getElementById('numPagina');
            
            if(contador) contador.textContent = `${Math.min(fim, total)}/${total}`;
            if(numPag) numPag.textContent = `${paginaAtual + 1}/${totalPaginas}`;

            // --- CORREÇÃO DOS BOTÕES (Display Flex vs None) ---
            const btnVoltar = document.getElementById('btnVoltar');
            const btnProximo = document.getElementById('btnProximo');
            btnVoltar.disabled = (paginaAtual === 0);
            btnProximo.disabled = (paginaAtual === totalPaginas - 1);

            if (btnVoltar) {
                // Esconde se for a página 0 (primeira)
                btnVoltar.style.display = (paginaAtual > 0) ? 'flex' : 'none';
            }

            if (btnProximo) {
                // Esconde se já mostrou todos os itens
                btnProximo.style.display = (fim < total) ? 'flex' : 'none';
            }

            return lista.slice(inicio, fim);
        }

        // 4. Funções de Controle (Globais)
        window.proximaPagina = function() {
            paginaAtual++;
            window.listar();
        }

        window.paginaAnterior = function() {
            if (paginaAtual > 0) {
                paginaAtual--;
                window.listar();
            }
        }

        // Função chamada pelo Select de Paginação
        window.mudarQtdPorPagina = function(valor) {
            paginaAtual = 0; // Reseta sempre que mudar a quantidade
            if (valor === 'all') {
                itensPorPagina = vagas.length > 0 ? vagas.length : 1000;
            } else {
                itensPorPagina = parseInt(valor);
            }
            window.listar();
        }

        // 5. Modal e Áreas
        window.abrirModal = function(vaga) {
            // Garante que o modal HTML existe antes de tentar preencher
            const modalEl = document.getElementById('modalVaga');
            if(!modalEl) {
                console.error("Modal HTML não encontrado!"); 
                return;
            }
            window.vagaSelecionada = vaga.codVaga;

            document.getElementById('detalheTitulo').innerText = vaga.titulo;
            document.getElementById('detalheEmpresa').innerText = vaga.empresa ? vaga.empresa.nome : '';
            document.getElementById('detalheArea').innerText = vaga.area;
            document.getElementById('detalheDescricao').innerText = vaga.descricao;

            const modal = new bootstrap.Modal(modalEl);
            modal.show();
        }

        function popularAreas() {
            const sel = document.getElementById('selectArea');
            if(!sel) return;
            sel.innerHTML = '<option value="">Todas</option>';
            
            const areas = [...new Set(vagas.map(v => v.area).filter(a => a))];
            areas.forEach(a => {
                const opt = document.createElement('option');
                opt.value = a;
                opt.textContent = a;
                sel.appendChild(opt);
            });
        }

        // Inicia a busca
        getVagas();
    }

    
    // --- LÓGICA DE LOGOUT ---
    const sairBtn = document.getElementById('sair');
    if (sairBtn) {
        sairBtn.addEventListener('click', (e) => {
            e.preventDefault();
            logout();
        });
    }
    

    function logout() {
        localStorage.removeItem('empresa');
        localStorage.removeItem('token');
        localStorage.removeItem('codEmpresa');
        localStorage.removeItem('user');
        window.location.href = 'index.html';
    }

    window.filtroAreaTag = function(event, areaNome) {
        // IMPEDE que o clique "suba" para a div pai (evita abrir o modal)
        if (event) event.stopPropagation();

        const select = document.getElementById('selectArea');
        if (select) {
            select.value = areaNome;
            window.paginaAtual = 0; // Reseta a página ao filtrar
            window.listar(); // Atualiza a lista
        }
    };

    window.encerrarVaga = async function(codVaga) {
        try {
            const response = await fetch(`http://localhost:8080/vagas/encerrar/${codVaga}/empresa/${localStorage.getItem('codEmpresa')}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (response.ok) {
                window.listar(); // Atualiza a lista após encerrar
            } else {
                console.error("Erro ao encerrar vaga");
            }
        } catch (error) {
            console.error("Erro ao encerrar vaga:", error);
        }
    };
});