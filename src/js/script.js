document.addEventListener('DOMContentLoaded', () => {
  // Fade in na carga da página
  document.body.classList.add('fade-in');

  // Transição de páginas com fade out
  document.querySelectorAll('.switch a').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const href = link.getAttribute('href');

      // Anima fade out no body
      document.body.classList.remove('fade-in');
      document.body.classList.add('fade-out');

      // Após animação, redireciona
      setTimeout(() => {
        window.location.href = href;
      }, 500); // tempo da animação
    });
  });

  // Troca da bandeira e tradução ao mudar o idioma
  const languageSelect = document.getElementById('language');
  const flagImg = document.getElementById('flag');

  const flagUrls = {
    pt: 'https://flagcdn.com/w40/br.png',
    en: 'https://flagcdn.com/w40/gb.png',
    es: 'https://flagcdn.com/w40/es.png',
    fr: 'https://flagcdn.com/w40/fr.png',
    ar: 'https://flagcdn.com/w40/sa.png',
    de: 'https://flagcdn.com/w40/de.png',
    it: 'https://flagcdn.com/w40/it.png',
    ru: 'https://flagcdn.com/w40/ru.png',
    zh: 'https://flagcdn.com/w40/cn.png',
    ja: 'https://flagcdn.com/w40/jp.png'
  };

  // Função para carregar JSON e aplicar tradução
  function applyTranslation(lang) {
    fetch(`https://abi-frontend-mu.vercel.app/src/lang/${lang}.json`)
      .then(res => {
        if (!res.ok) throw new Error('Erro ao carregar arquivo de idioma');
        return res.json();
      })
      .then(data => {
        // Para cada elemento com data-i18n, substitui texto
        document.querySelectorAll('[data-i18n]').forEach(elem => {
          const key = elem.getAttribute('data-i18n');
          if (data[key]) {
            if (elem.tagName.toLowerCase() === 'input' || elem.tagName.toLowerCase() === 'textarea') {
              elem.placeholder = data[key];
            } else {
              elem.innerHTML = data[key];
            }
          }
        });
      })
      .catch(err => {
        console.error(err);
      });
  }

  // Evento para mudar idioma e atualizar bandeira + tradução
  languageSelect.addEventListener('change', () => {
    const selectedLang = languageSelect.value;

    // Troca bandeira
    if (flagUrls[selectedLang]) {
      flagImg.src = flagUrls[selectedLang];
      flagImg.alt = `Bandeira ${selectedLang}`;
    }

    // Aplica tradução
    applyTranslation(selectedLang);

    // Salvar idioma no localStorage para persistir
    localStorage.setItem('selectedLang', selectedLang);
  });

  // Ao carregar a página, verifica idioma salvo e aplica
  const savedLang = localStorage.getItem('selectedLang') || 'pt';
  languageSelect.value = savedLang;

  if (flagUrls[savedLang]) {
    flagImg.src = flagUrls[savedLang];
    flagImg.alt = `Bandeira ${savedLang}`;
  }

  applyTranslation(savedLang);
});
