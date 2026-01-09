document.addEventListener('DOMContentLoaded', () => {

    // 1. Recuperar dados da empresa logada e verificar a sessão
    const empresaString = localStorage.getItem('empresa');
    if (!empresaString) {
        // Esta verificação é crucial para evitar erros de codEmpresa ausente
        // Se precisar de testes visuais, comente as duas linhas abaixo
        alert('Sessão expirada. Faça login novamente.');
        // window.location.href = 'portal-empresa.html';
        // return;
    }
    
    // Assume que a empresa está logada para continuar a lógica
    const empresaLogada = empresaString ? JSON.parse(empresaString) : { codEmpresa: 1, nome: "Empresa Teste (Mock)" };

    // --- LÓGICA DE PUBLICAR VAGA ---
    const formPublicar = document.getElementById('formPublicarVaga');

    if (formPublicar) {
        formPublicar.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Pegar valores dos inputs pelos IDs
            const titulo = document.getElementById('vagaTitulo').value;
            const area = document.getElementById('vagaArea').value;
            const descricao = document.getElementById('vagaDescricao').value;
            const salario = document.getElementById('vagaSalario').value;

            const descricaoFinal = salario ? `${descricao} \n\nSalário: ${salario}` : descricao;

            // Montar objeto VagaRequestDTO
            const vagaDTO = {
                titulo: titulo,
                descricao: descricaoFinal,
                area: area,
                // Usa o ID da empresa logada
                codEmpresa: empresaLogada.codEmpresa 
            };

            const btn = document.getElementById('btnPublicar');
            const textoOriginal = btn.innerText;
            btn.innerText = 'Publicando...';
            btn.disabled = true;

            try {
                // Enviar para o Backend (VagaController POST /vagas)
                const response = await fetch('http://localhost:8080/vagas', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(vagaDTO)
                });

                if (response.ok) {
                    alert('Vaga publicada com sucesso!');
                    formPublicar.reset(); 
                    // Redireciona para o Início do Painel
                    document.querySelector('a[onclick="showSection(\'inicioEmp\')"]').click(); 
                } else {
                    const errorText = await response.text();
                    alert('Erro ao publicar: ' + errorText);
                }
            } catch (error) {
                console.error(error);
                alert('Erro de conexão com o servidor. Verifique se o backend está rodando.');
            } finally {
                btn.innerText = textoOriginal;
                btn.disabled = false;
            }
        });
    }
});