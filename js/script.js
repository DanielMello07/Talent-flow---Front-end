document.addEventListener('DOMContentLoaded', () => {
    const navbar = document.getElementById('mainNavbar');
    if (!navbar) return;

    function updateNavbarState() {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
    }

    updateNavbarState();
    window.addEventListener('scroll', updateNavbarState);
});
