document.addEventListener('DOMContentLoaded', () => {
    const containers = document.querySelectorAll('[data-tf-header]');
    if (!containers.length) return;

    function buildSectionLink(label, sectionId, active) {
        return `
            <li class="nav-item">
                <a class="nav-link ${active === sectionId ? 'active' : ''}" href="#" data-section-target="${sectionId}">${label}</a>
            </li>
        `;
    }

    function buildPublicNav(active) {
        return `
            <nav class="navbar navbar-expand-lg navbar-dark fixed-top" id="mainNavbar">
                <div class="container">
                    <a class="navbar-brand fw-bold" href="index.html">
                        <i class="bi bi-diagram-3-fill me-2"></i>TalentFlow
                    </a>
                    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                        <span class="navbar-toggler-icon"></span>
                    </button>
                    <div class="collapse navbar-collapse" id="navbarNav">
                        <ul class="navbar-nav ms-auto align-items-center">
                            <li class="nav-item"><a class="nav-link ${active === 'home' ? 'active' : ''}" href="index.html">Início</a></li>
                            <li class="nav-item"><a class="nav-link ${active === 'jobs' ? 'active' : ''}" href="vagas.html">Vagas</a></li>
                            <li class="nav-item"><a class="nav-link ${active === 'company-login' ? 'active' : ''}" href="empresa-login.html">Empresas</a></li>
                            <li class="nav-item ms-lg-3">
                                <a class="nav-link fw-bold ${active === 'candidate-login' ? 'active' : ''}" href="candidato-login.html">Login</a>
                            </li>
                            <li class="nav-item ms-lg-2">
                                <a class="btn btn-light rounded-pill px-4 fw-bold shadow-sm" href="cadastro.html">Cadastre-se</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        `;
    }

    function buildCandidateNav(active) {
        return `
            <nav class="navbar navbar-expand-lg navbar-dark fixed-top" id="mainNavbar">
                <div class="container">
                    <a class="navbar-brand fw-bold" href="dashboard-candidato.html">
                        <i class="bi bi-diagram-3-fill me-2"></i>TalentFlow
                    </a>
                    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                        <span class="navbar-toggler-icon"></span>
                    </button>
                    <div class="collapse navbar-collapse" id="navbarNav">
                        <ul class="navbar-nav ms-auto align-items-center">
                            ${buildSectionLink('Início', 'inicio', active)}
                            <li class="nav-item"><a class="nav-link ${active === 'jobs' ? 'active' : ''}" href="vagas.html">Vagas</a></li>
                            ${buildSectionLink('Candidaturas', 'vagas', active)}
                            ${buildSectionLink('Perfil', 'perfil', active)}
                            ${buildSectionLink('Currículo', 'curriculo', active)}
                            <li class="nav-item ms-lg-3">
                                <a class="nav-link fw-bold" href="javascript:void(0)" onclick="fazerLogout()">Sair</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        `;
    }

    function buildCandidateJobsNav(active) {
        return `
            <nav class="navbar navbar-expand-lg navbar-dark fixed-top" id="mainNavbar">
                <div class="container">
                    <a class="navbar-brand fw-bold" href="dashboard-candidato.html">
                        <i class="bi bi-diagram-3-fill me-2"></i>TalentFlow
                    </a>
                    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                        <span class="navbar-toggler-icon"></span>
                    </button>
                    <div class="collapse navbar-collapse" id="navbarNav">
                        <ul class="navbar-nav ms-auto align-items-center">
                            <li class="nav-item"><a class="nav-link" href="dashboard-candidato.html">Meu Painel</a></li>
                            <li class="nav-item"><a class="nav-link ${active === 'jobs' ? 'active' : ''}" href="vagas.html">Vagas</a></li>
                            <li class="nav-item ms-lg-3">
                                <a class="nav-link fw-bold" href="javascript:void(0)" onclick="logout()">Sair</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        `;
    }

    function buildCompanyNav(active) {
        return `
            <nav class="navbar navbar-expand-lg navbar-dark fixed-top" id="mainNavbar">
                <div class="container">
                    <a class="navbar-brand fw-bold" href="dashboard-empresa.html">
                        <i class="bi bi-diagram-3-fill me-2"></i>TalentFlow
                    </a>
                    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                        <span class="navbar-toggler-icon"></span>
                    </button>
                    <div class="collapse navbar-collapse" id="navbarNav">
                        <ul class="navbar-nav ms-auto align-items-center">
                            ${buildSectionLink('Início', 'inicioEmp', active)}
                            ${buildSectionLink('Publicar Vaga', 'publicar', active)}
                            ${buildSectionLink('Vagas Publicadas', 'vagas', active)}
                            ${buildSectionLink('Candidaturas', 'candidaturas', active)}
                            <li class="nav-item">
                                <a class="nav-link ${active === 'infos' ? 'active' : ''}" id="empresaInfo" href="#" data-section-target="infos">Informações</a>
                            </li>
                            <li class="nav-item ms-lg-3">
                                <a class="nav-link fw-bold" href="index.html" id="sair">Sair</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        `;
    }

    function renderHeader(container) {
        const context = container.dataset.context || 'public';
        const active = container.dataset.active || 'home';

        if (context === 'candidate') {
            container.innerHTML = buildCandidateNav(active);
            return;
        }

        if (context === 'candidate-jobs') {
            container.innerHTML = buildCandidateJobsNav(active);
            return;
        }

        if (context === 'company') {
            container.innerHTML = buildCompanyNav(active);
            return;
        }

        container.innerHTML = buildPublicNav(active);
    }

    function bindSectionNavigation(root) {
        root.querySelectorAll('[data-section-target]').forEach((link) => {
            link.addEventListener('click', (event) => {
                event.preventDefault();
                const sectionId = link.dataset.sectionTarget;
                if (typeof window.showSection === 'function') {
                    window.showSection(sectionId);
                }
            });
        });
    }

    containers.forEach((container) => {
        renderHeader(container);
        bindSectionNavigation(container);
    });

    const navbar = document.getElementById('mainNavbar');
    if (navbar) {
        const updateNavbarState = () => {
            navbar.classList.toggle('scrolled', window.scrollY > 50);
        };

        updateNavbarState();
        window.addEventListener('scroll', updateNavbarState);
    }

    window.TalentFlowHeader = {
        setActive(activeId) {
            document.querySelectorAll('[data-tf-header] .nav-link').forEach((link) => {
                const matchesSection = link.dataset.sectionTarget === activeId;
                const matchesJobs = activeId === 'jobs' && link.getAttribute('href') === 'vagas.html';
                link.classList.toggle('active', matchesSection || matchesJobs);
            });
        }
    };
});
