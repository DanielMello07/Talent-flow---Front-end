document.addEventListener('DOMContentLoaded', () => {
    const empresaNome = document.getElementById('infoNome');
    const empresaCnpj = document.getElementById('infoCNPJ');
    const empresaTelefone = document.getElementById('infoTelefone');
    const empresaDescricao = document.getElementById('infoDescricao');
    const empresaEmail = document.getElementById('infoEmail');
    const formEditarEmpresa = document.getElementById('formEditarEmpresa');
    const modalEditarEmpresaEl = document.getElementById('modalEditarEmpresa');

    if (!empresaNome || !empresaCnpj || !empresaTelefone || !empresaDescricao || !empresaEmail || !formEditarEmpresa || !modalEditarEmpresaEl) {
        return;
    }

    const modalEditarEmpresa = new bootstrap.Modal(modalEditarEmpresaEl);

    function preencherInfosEmpresa(dadosEmpresa) {
        empresaNome.textContent = dadosEmpresa.nome || 'N/A';
        empresaCnpj.textContent = dadosEmpresa.cnpj || 'N/A';
        empresaTelefone.textContent = dadosEmpresa.contatoRecrutador || 'N/A';
        empresaDescricao.textContent = dadosEmpresa.descricao || 'N/A';
        empresaEmail.textContent = dadosEmpresa.emailCorporativo || 'N/A';
    }

    function preencherFormularioEmpresa(dadosEmpresa) {
        document.getElementById('editEmpresaNome').value = dadosEmpresa.nome || '';
        document.getElementById('editEmpresaEmail').value = dadosEmpresa.emailCorporativo || '';
        document.getElementById('editEmpresaCnpj').value = dadosEmpresa.cnpj || '';
        document.getElementById('editEmpresaTelefone').value = dadosEmpresa.contatoRecrutador || '';
        document.getElementById('editEmpresaDescricao').value = dadosEmpresa.descricao || '';
    }

    async function carregarInformacoesEmpresa() {
        try {
            const response = await fetch('https://talentflow-gfq3.onrender.com/empresas/informacoes/' + localStorage.getItem('codEmpresa'), {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!response.ok) {
                throw new Error(`Erro ao carregar informações da empresa (${response.status})`);
            }

            const dadosEmpresa = await response.json();
            window.empresaAtual = dadosEmpresa;
            preencherInfosEmpresa(dadosEmpresa);
            preencherFormularioEmpresa(dadosEmpresa);
            return dadosEmpresa;
        } catch (error) {
            console.error('Erro ao carregar informações da empresa:', error);
            alert('Erro ao carregar informações da empresa. Por favor, tente novamente.');
            return null;
        }
    }

    formEditarEmpresa.addEventListener('submit', async (event) => {
        event.preventDefault();

        const btnSalvarEmpresa = document.getElementById('btnSalvarEmpresa');
        const textoOriginal = btnSalvarEmpresa.innerText;
        btnSalvarEmpresa.disabled = true;
        btnSalvarEmpresa.innerText = 'Salvando...';

        const payload = {
            nome: document.getElementById('editEmpresaNome').value.trim(),
            emailCorporativo: document.getElementById('editEmpresaEmail').value.trim(),
            cnpj: document.getElementById('editEmpresaCnpj').value.trim(),
            contatoRecrutador: document.getElementById('editEmpresaTelefone').value.trim(),
            descricao: document.getElementById('editEmpresaDescricao').value.trim(),
            senha: window.empresaAtual?.senha || ''
        };

        try {
            const response = await fetch(`https://talentflow-gfq3.onrender.com/empresas/${localStorage.getItem('codEmpresa')}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error(`Erro ao salvar (${response.status})`);
            }

            window.empresaAtual = { ...(window.empresaAtual || {}), ...payload };
            preencherInfosEmpresa(window.empresaAtual);
            modalEditarEmpresa.hide();
            alert('Informações da empresa atualizadas com sucesso!');
        } catch (error) {
            console.error('Erro ao salvar empresa:', error);
            alert('Não foi possível salvar as alterações da empresa.');
        } finally {
            btnSalvarEmpresa.disabled = false;
            btnSalvarEmpresa.innerText = textoOriginal;
        }
    });

    carregarInformacoesEmpresa();
});
