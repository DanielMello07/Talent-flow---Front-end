// Aguarda o carregamento do DOM
document.addEventListener('DOMContentLoaded', function() {
    
    // Efeito de scroll na Navbar
    const navbar = document.getElementById('mainNavbar');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Aqui futuramente você colocará as chamadas para a sua API Java
    // Exemplo: fetch('https://talentflow-gfq3.onrender.com/vagas')...
    console.log("TalentFlow Frontend Iniciado!");
});