import { GUIA, INDEX, LOGIN, SOBRE } from "./urls.js";
import { verificar } from './utilidades/verificarLogin.js'

document.addEventListener('DOMContentLoaded', () => {
    verificar();
    
    // Seletores principais
    const selectors = {
        navLinks: document.querySelectorAll('nav a'),
        userIcon: document.querySelector('.user-icon'),
        userDropdown: document.querySelector('.user-dropdown'),
        btnLogin: document.getElementById('btnLogin'),
        btnLogout: document.getElementById('btnLogout')
    };


    // Fecha todos os dropdowns
    function closeDropdowns() {
        selectors.userDropdown.classList.remove('open');
        selectors.userDropdown.setAttribute('aria-hidden', 'true');
    }

    // Dropdown de usuário
    selectors.userIcon.addEventListener('click', e => {
        e.stopPropagation();
        const isOpen = selectors.userDropdown.classList.contains('open');
        closeDropdowns();
        if (!isOpen) {
            selectors.userDropdown.classList.add('open');
            selectors.userDropdown.setAttribute('aria-hidden', 'false');
        }
    });

    // Ações de login/logout
    selectors.btnLogin.addEventListener('click', () => {
        window.location.replace(LOGIN);
    });

    selectors.btnLogout.addEventListener('click', () => {
        // vai realmente deslogar o usuário
        localStorage.removeItem('idUsuario');
        // vai desativar os links
        verificar();

        selectors.btnLogout.style.display = 'none';
        selectors.btnLogin.style.display = 'block';
        selectors.userDropdown.classList.remove('open');
        selectors.userDropdown.setAttribute('aria-hidden', 'true');
        alert('Você saiu da sessão!');

        // se a pagina atual for diferente da pagina inical, guia ou sobre
        if (window.location !== GUIA && window.location !== SOBRE && window.location !== INDEX) {
            // manda para a pagina index
            window.location.replace(INDEX);
        }
    });

    // Suporte a teclado
    function addKeyboardSupport(element, action) {
        element.addEventListener('keydown', e => {
            if (['Enter', ' '].includes(e.key)) {
                e.preventDefault();
                action();
            }
        });
    }

    addKeyboardSupport(selectors.userIcon, () => selectors.userIcon.click());
    addKeyboardSupport(selectors.btnLogin, () => selectors.btnLogin.click());
    addKeyboardSupport(selectors.btnLogout, () => selectors.btnLogout.click());

    // Fecha dropdowns ao clicar fora
    document.addEventListener('click', closeDropdowns);
});