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
            const response = await fetch(`./lang/${lang}.json`);
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
        window.location.href = 'Login.html';
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

document.addEventListener('DOMContentLoaded', () => {
    const listaEmpresas = document.getElementById('listaEmpresas');
    const filtroSelect = document.getElementById('filtroSelect');
    const btnFiltrar = document.getElementById('btnFiltrar');
    const btnPaginaAnterior = document.getElementById('btnPaginaAnterior');
    const btnPaginaProxima = document.getElementById('btnPaginaProxima');
    const paginaAtualSpan = document.getElementById('paginaAtual');

    let paginaAtual = 1;
    const qntPorPagina = 10;
    let filtroAtual = '';

    async function carregarEmpresas() {
        try {
            let url = `https://abi-backend-vtx4.onrender.com/empresas/listar-empresas?qnt=${qntPorPagina}&pagina=${paginaAtual}`;
            if (filtroAtual.trim() !== '') {
                url = `https://abi-backend-vtx4.onrender.com/empresas/listar-empresas/filtro?qnt=${qntPorPagina}&pagina=${paginaAtual}&filtro=${encodeURIComponent(filtroAtual)}`;
            }

            const response = await fetch(url);
            if (!response.ok) throw new Error('Erro ao carregar empresas');

            const data = await response.json();

            listaEmpresas.innerHTML = '';

            if (!data || data.length === 0) {
                listaEmpresas.innerHTML = '<p>Nenhuma empresa encontrada.</p>';
                btnPaginaProxima.disabled = true;
                btnPaginaAnterior.disabled = paginaAtual === 1;
                return;
            }

            data.forEach(empresa => {
                const div = document.createElement('div');
                div.classList.add('empresa-item');
                div.innerHTML = `
  <h3>${empresa.nome}</h3>
  <p><strong>Categoria:</strong> ${empresa.categoria}</p>
  <p><strong>Descrição empresa:</strong> ${empresa.descricao}</p>
  <p><strong>Função:</strong> ${empresa.funcao}</p>
  <button class="btn-mais-info" onclick="maisInformacoes('${empresa.id}')">Mais informações</button>
`;
                listaEmpresas.appendChild(div);

            });

            // Controle dos botões de paginação
            btnPaginaAnterior.disabled = paginaAtual === 1;
            btnPaginaProxima.disabled = data.length < qntPorPagina;

            paginaAtualSpan.textContent = `Página ${paginaAtual}`;
        } catch (error) {
            listaEmpresas.innerHTML = `<p>Erro ao carregar empresas: ${error.message}</p>`;
            btnPaginaAnterior.disabled = true;
            btnPaginaProxima.disabled = true;
        }
    }

    btnFiltrar.addEventListener('click', () => {
        filtroAtual = filtroSelect.value;
        paginaAtual = 1;
        carregarEmpresas();
    });

    btnPaginaAnterior.addEventListener('click', () => {
        if (paginaAtual > 1) {
            paginaAtual--;
            carregarEmpresas();
        }
    });

    btnPaginaProxima.addEventListener('click', () => {
        paginaAtual++;
        carregarEmpresas();
    });

    // Carrega inicialmente sem filtro
    carregarEmpresas();
});
