const API_BASE_URL = "http://localhost:8080";

const TalentAPI = {
    async fetchVagas() {
        try {
            const response = await fetch(`${API_BASE_URL}/vagas`);
            if (!response.ok) throw new Error("Erro ao buscar vagas");
            return await response.json();
        } catch (err) {
            console.error(err);
            return [];
        }
    }
    // Outros métodos como loginCandidato() etc virão aqui
};