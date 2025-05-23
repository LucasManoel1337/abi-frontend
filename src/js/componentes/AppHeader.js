import { INDEX, GUIA, INSTI, EMPRESAS, BOLSAS, PSICOLOGIA, SAUDE, LOGO } from "../urls.js"; 

class AppHeader extends HTMLElement {
    constructor() {
        super();

        this.logoPath = LOGO;
        this.indexPath = INDEX;

        // Links que aparecem no navbar
        this.navLinks = [
            { href: INDEX, text: 'Sobre o projeto', key: 'sobre' },
            { href: GUIA, text: 'Guia', key: 'guia' },
            { href: INSTI, text: 'Instituições', key: 'instituicoes' },
            { href: EMPRESAS, text: 'Empresas', key: 'empresas' },
            { href: BOLSAS, text: 'Bolsas', key: 'bolsas' },
            { href: PSICOLOGIA, text: 'Psicologia', key: 'psicologia' },
            { href: SAUDE, text: 'Saúde', key: 'saude' }
        ];

        this.languageOptions = [
            { value: 'pt', text: 'Português' },
            { value: 'en', text: 'English' },
            { value: 'es', text: 'Español' },
            { value: 'fr', text: 'Français' },
            { value: 'ar', text: 'العربية' },
            { value: 'de', text: 'Deutsch' },
            { value: 'it', text: 'Italiano' },
            { value: 'ru', text: 'Русский' },
            { value: 'zh', text: '中文' },
            { value: 'ja', text: '日本語' }
        ];
    }

    connectedCallback() {
        this.render();
        // Os event listeners e a lógica de inicialização (tradução, verificar login)
        // seriam adicionados por scripts externos que selecionam os elementos por ID/classe.
    }

    render() {
        const navLinksHtml = this.navLinks.map(link => `
            <li class="nav-item">
                <a class="nav-link" href="${link.href}" data-key="${link.key}">${link.text}</a>
            </li>
        `).join('');

        const langOptionsHtml = this.languageOptions.map(lang => `
            <option value="${lang.value}">${lang.text}</option>
        `).join('');

        this.innerHTML = `
            <header class="navbar navbar-expand-lg navbar-dark fixed-top app-header-custom">
                <div class="container-fluid">
                    <a class="navbar-brand logo-container-custom" href="${this.indexPath}" aria-label="Logo do Projeto AIB">
                        <img src="${this.logoPath}" alt="Logo AIB" class="app-header-logo-img" />
                        <h1 class="app-header-title">ABI</h1>
                    </a>
                    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#appHeaderNavbarContent" aria-controls="appHeaderNavbarContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span class="navbar-toggler-icon"></span>
                    </button>
                    <div class="collapse navbar-collapse" id="appHeaderNavbarContent">
                        <ul class="navbar-nav me-auto mb-2 mb-lg-0" id="appHeaderNavLinksContainer">
                            ${navLinksHtml}
                        </ul>
                        <div class="d-flex align-items-center gap-3 ms-lg-auto">
                            <div class="language-selector-wrapper d-flex align-items-center gap-2">
                                <img src="https://flagcdn.com/w40/br.png" alt="Bandeira do idioma" id="bandeira" class="app-header-flag-img" />
                                <select class='form-select form-select-sm' id="select-lingua" name="select-lingua" aria-label="Selecionar idioma">
                                    ${langOptionsHtml}
                                </select>
                            </div>
                            <div class="user-area position-relative">
                                <svg class="user-icon" id="user-icon" role="button" aria-label="Área do usuário" tabindex="0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                                </svg>
                                <div class="user-dropdown position-absolute bg-white rounded shadow-sm py-1" id="user-dropdown" role="menu" aria-hidden="true">
                                    <button class="dropdown-item" data-key="loginTitle" id="btnLogin" role="menuitem">Logar</button>
                                    <button class="dropdown-item" id="btnLogout" role="menuitem" style="display:none;" data-key="deslogarTitle">Deslogar</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>
            <style>
                .app-header-custom {
                    background-color: #004466; /* */
                    padding-top: 5px;
                    padding-bottom: 5px;
                    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2); /* */
                }
                .app-header-logo-img {
                    height: 40px; /* */
                    width: 40px; /* */
                    object-fit: contain; /* */
                    margin-right: 10px;
                }
                .app-header-title {
                    font-size: 1.4rem; /* */
                    font-weight: 700; /* */
                    margin: 0;
                    color: white;
                    display: inline-block;
                    vertical-align: middle;
                }
                .navbar-dark .navbar-nav .nav-link {
                    color: white;
                    font-weight: 600; /* */
                    padding: 6px 10px; /* */
                    border-radius: 4px; /* */
                    transition: background-color 0.25s ease; /* */
                }
                .navbar-dark .navbar-nav .nav-link:hover {
                    background-color: #006699; /* */
                }
                .app-header-flag-img {
                    height: 20px; /* */
                    width: 28px; /* */
                    object-fit: cover; /* */
                    border-radius: 3px; /* */
                    border: 1px solid #ddd; /* */
                }
                #select-lingua { /* Usando o ID original para compatibilidade com traduzir.js */
                    color: #333;
                    background-color: white;
                    border: 1px solid #ccc;
                }
                .user-icon { /* Usando o ID original para compatibilidade com index.js */
                    width: 36px; /* */
                    height: 36px; /* */
                    fill: white; /* */
                    cursor: pointer;
                    transition: fill 0.3s ease; /* */
                }
                .user-icon:hover {
                    fill: #00aaff; /* */
                }
                .user-dropdown { /* Usando o ID original para compatibilidade com index.js */
                    top: 120%;
                    right: 0;
                    min-width: 140px; /* */
                    z-index: 30; /* */
                    display: none; /* Controlado por JS externo */
                }
                .user-dropdown.open { /* Classe para ser adicionada por JS externo */
                     display: block !important;
                }
                .user-dropdown .dropdown-item {
                    background: transparent;
                    border: none;
                    padding: 12px 18px; /* */
                    font-size: 1rem; /* */
                    color: #004466; /* */
                    text-align: left;
                    cursor: pointer;
                    width: 100%;
                    transition: background-color 0.25s ease; /* */
                }
                .user-dropdown .dropdown-item:hover {
                    background-color: #e0f0ff; /* */
                }
            </style>
        `;
    }
}

customElements.define('app-header', AppHeader);