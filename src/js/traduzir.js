/**
 * autor     : Kayo Victor
 * descrição : Vai traduzir as paginas para o idioma que o usuário preferir
 */
// link das imagens das bandeiras
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

// vai analisar se já há uma lingua selecionada no LocalStorage
const analisarLocalStorage = () => {   
    // pega o item lingua no localstorage
    let lingua = localStorage.getItem('lingua');

    // se lingua não tiver sido selecionada
    if (!lingua) {
        // bota a lingua padrão: português
        localStorage.setItem('lingua', 'pt');
    }
}

/**
 * vai mudar a bandeira ao lado do select
 * @param {String} lingua lingua que representa a bandeira a ser colocada
 */
const mudarBandeira = (lingua) => {
    const imgBandeira  = document.getElementById('bandeira');
    // coloca a imagem da bandeira
    imgBandeira.src = flagUrls[lingua];
    // muda o alt
    imgBandeira.alt = `bandeira ${lingua}`
}

/**
 * vai pegar os dados json da lingua selecionada
 * @param {String} lingua lingua da tradução
 */
const carregarTraducao = async (lingua) => {
    try {
        // vai pegar os dados do arquivo da lingua
        const resposta = await fetch(`https://abi-frontend-mu.vercel.app/src/json/lang/${lingua}.json`);
        // se a resposta não está ok
        if (!resposta.ok) {
            throw new Error("Erro ao carregar traduções");
        }

        return await resposta.json();
    } catch (err) {
        console.error('Erro ao carregar tradução:', err);
    }
}

/**
 * Vai aplicar a tradução selecionada na página
 * @param {Object} traducaoJson Objeto contendo a tradução
 */
const aplicarTraducao = (traducaoJson) => {
    // passa por todos os elementos que tem o atributo [data-key]
    document.querySelectorAll('[data-key]').forEach(el => {
        // pega a chave que o elemento representa
        const chave = el.dataset.key;
        // se a chave está presente na tradução
        if (traducaoJson[chave]) {
            // coloca a tradução no texto do elemento
            el.innerHTML = traducaoJson[chave];
        }
    })
}

// codigo que vai rodar quando a pagina carregar
document.addEventListener('DOMContentLoaded', async () => {
    // vai ver se há uma lingua selecionada
    analisarLocalStorage();

    // pega o select de linguas da pagina
    const selectLingua = document.getElementById('select-lingua');

    // vai selecionar a opção de lingua que está no LocalStorage
    selectLingua.value = localStorage.getItem('lingua');
    // muda a bandeira do lado so select
    mudarBandeira(localStorage.getItem('lingua'));

    // se a lingua selecionada for diferente da lingua padrão
    if (localStorage.getItem('lingua') !== 'pt') {
        aplicarTraducao(await carregarTraducao(selectLingua.value));
    }

    // adiciona uma função que vai rodar quando o usuário mudar o select
    selectLingua.addEventListener('change', async () => {
        // muda a bandeira
        mudarBandeira(selectLingua.value);
        // coloca a nova lingua selecionada no localstorage
        localStorage.setItem('lingua', selectLingua.value);

        // vai pegar os arquivos de tradução e logo após aplicar a tradução na pagina
        aplicarTraducao(await carregarTraducao(selectLingua.value));
    })
})