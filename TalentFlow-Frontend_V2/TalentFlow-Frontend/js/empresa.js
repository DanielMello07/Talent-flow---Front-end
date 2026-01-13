document.addEventListener('DOMContentLoaded', () => {

    // --- LÓGICA PARA PUBLICAR VAGA ---
    const formPublicar = document.getElementById('formPublicarVaga');

    if (formPublicar) {
        formPublicar.addEventListener('submit', async (e) => {
            e.preventDefault();

            // 1. Recuperar dados da empresa logada (Salva no localStorage durante o login)
            const empresaLogada = JSON.parse(localStorage.getItem('empresa'));

            if (!empresaLogada || !empresaLogada.codEmpresa) {
                alert('Erro: Você precisa estar logado como empresa para publicar.');
                window.location.href = 'portal-empresa.html';
                return;
            }

            // 2. Pegar valores do formulário
            const titulo = document.getElementById('vagaTitulo').value;
            const area = document.getElementById('vagaArea').value;
            const descricao = document.getElementById('vagaDescricao').value;
            // Opcional: concatenar salário na descrição, já que o DTO não tem campo salário específico
            const salario = document.getElementById('vagaSalario').value;
            const descricaoCompleta = salario ? `${descricao} \n\nSalário: ${salario}` : descricao;

            // 3. Montar o objeto conforme VagaRequestDTO.java 
            const vagaDTO = {
                titulo: titulo,
                descricao: descricaoCompleta,
                area: area,
                codEmpresa: empresaLogada.codEmpresa // ID da empresa é obrigatório
            };

            const btn = document.getElementById('btnPublicar');
            const originalText = btn.innerText;
            btn.innerText = 'Publicando...';
            btn.disabled = true;

            try {
                // 4. Enviar para o Backend (VagaController) 
                const response = await fetch('http://localhost:8080/vagas', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(vagaDTO)
                });

                if (response.ok) {
                    alert('Vaga publicada com sucesso!');
                    formPublicar.reset(); // Limpa o formulário
                    // Aqui você poderia chamar uma função para recarregar a lista de vagas
                } else {
                    const errorText = await response.text();
                    alert('Erro ao publicar: ' + errorText);
                }
            } catch (error) {
                console.error(error);
                alert('Erro de conexão com o servidor.');
            } finally {
                btn.innerText = originalText;
                btn.disabled = false;
            }
        });
    }
});