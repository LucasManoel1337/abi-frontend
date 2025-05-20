import { LOGIN } from "./urls.js";

document.addEventListener('DOMContentLoaded', () => {
            // Seletores principais
            const selectors = {
                languageSelector: document.querySelector('.language-selector'),
                languageOptions: document.querySelector('.language-options'),
                languageNameSpan: document.getElementById('language-name'),
                flagImg: document.getElementById('flag-img'),
                navLinks: document.querySelectorAll('nav a'),
                userIcon: document.querySelector('.user-icon'),
                userDropdown: document.querySelector('.user-dropdown'),
                btnLogin: document.getElementById('btnLogin'),
                btnLogout: document.getElementById('btnLogout')
            };

            let currentTranslations = {};

            // Carrega traduções de idioma
            async function loadTranslations(lang) {
                try {
                    const response = await fetch(`../lang/${lang}.json`);
                    if (!response.ok) throw new Error("Erro ao carregar traduções");
                    currentTranslations = await response.json();
                    updateTranslatedElements(); // usa a função genérica agora
                } catch (error) {
                    console.error("Erro ao carregar traduções:", error);
                }
            }

            // Atualiza os textos do menu
            function updateTranslatedElements() {
                document.querySelectorAll('[data-key]').forEach(el => {
                    const key = el.dataset.key;
                    if (currentTranslations[key]) {
                        el.textContent = currentTranslations[key];
                    }
                });
            }

            // Fecha todos os dropdowns
            function closeDropdowns() {
                selectors.languageOptions.classList.remove('open');
                selectors.languageSelector.classList.remove('open');
                selectors.languageSelector.setAttribute('aria-expanded', 'false');
                selectors.userDropdown.classList.remove('open');
                selectors.userDropdown.setAttribute('aria-hidden', 'true');
            }

            // Alterna o dropdown de idioma
            selectors.languageSelector.addEventListener('click', e => {
                e.stopPropagation();
                const isOpen = selectors.languageOptions.classList.contains('open');
                closeDropdowns();
                if (!isOpen) {
                    selectors.languageOptions.classList.add('open');
                    selectors.languageSelector.classList.add('open');
                    selectors.languageSelector.setAttribute('aria-expanded', 'true');
                }
            });

            // Seleção de idioma
            selectors.languageOptions.querySelectorAll('div').forEach(option => {
                option.addEventListener('click', () => {
                    const selectedLang = option.dataset.lang;
                    selectors.languageNameSpan.textContent = option.textContent.trim();
                    selectors.flagImg.src = option.querySelector('img').src;
                    selectors.flagImg.alt = option.querySelector('img').alt;
                    loadTranslations(selectedLang);
                    closeDropdowns();
                });
            });

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
                selectors.btnLogout.style.display = 'none';
                selectors.btnLogin.style.display = 'block';
                selectors.userDropdown.classList.remove('open');
                selectors.userDropdown.setAttribute('aria-hidden', 'true');
                alert('Você saiu da sessão!');
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

            addKeyboardSupport(selectors.languageSelector, () => selectors.languageSelector.click());
            selectors.languageOptions.querySelectorAll('div').forEach(option => {
                addKeyboardSupport(option, () => option.click());
            });
            addKeyboardSupport(selectors.userIcon, () => selectors.userIcon.click());
            addKeyboardSupport(selectors.btnLogin, () => selectors.btnLogin.click());
            addKeyboardSupport(selectors.btnLogout, () => selectors.btnLogout.click());

            // Fecha dropdowns ao clicar fora
            document.addEventListener('click', closeDropdowns);

            // Inicializa com idioma padrão
            loadTranslations('pt');
        });