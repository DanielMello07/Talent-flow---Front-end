// URL base do Back-end Spring Boot
const API_BASE_URL = 'http://localhost:8080/enderecos/';

// Função principal disparada pelo onblur no campo CEP
async function buscarEndereco() {
    const cepInput = document.getElementById('cep');
    const cep = cepInput.value.replace(/\D/g, '');

    limparCamposEndereco();

    if (cep.length !== 8) {
        if (cep.length > 0) {
             console.log("CEP incompleto. Aguardando 8 dígitos.");
        }
        return;
    }

    try {
        const response = await fetch(API_BASE_URL + cep);

        if (!response.ok) {
            const errorBody = await response.text();
            throw new Error(`Erro ${response.status}: ${errorBody.substring(0, 100)}`);
        }

        const data = await response.json();

        if (data.erro === true) {
            alert("CEP não encontrado ou inválido. Digite um CEP válido.");
            cepInput.focus();
            return;
        }

        // Mapeamento e Autocomplete:
        document.getElementById('rua').value = data.logradouro || '';
        document.getElementById('bairro').value = data.bairro || '';
        document.getElementById('cidade').value = data.localidade || '';
        document.getElementById('estado').value = data.uf || '';

        document.getElementById('numero').focus();

    } catch (error) {
        console.error('Erro na busca de endereço:', error);
        alert('Falha ao conectar ou buscar o CEP. Tente novamente.');
    }
}

// Função auxiliar para resetar os campos
function limparCamposEndereco() {
    document.getElementById('rua').value = '';
    document.getElementById('bairro').value = '';
    document.getElementById('cidade').value = '';
    document.getElementById('estado').value = '';
}