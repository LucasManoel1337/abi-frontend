import { carregarEmpresas } from "./servidor/empresaHandler.js";
import { carregar } from './utilidades/carregando.js'

/**
 * Vai pegar as empresas que foram pegas no banco e colocar no html
 * @param {Array} empresas Objetos com informações das empresas pegas no banco
 * @param {Object} elsHtml Objeto contendo referencias aos elementos html
 * @param {Number} paginaAtual Número da página atual
 * @returns 
 */
const aplicarDados = (empresas, elsHtml, paginaAtual) => {
    // reseta a lista
    elsHtml.listaEmpresas.innerHTML = '';

    // se empresas não existir ou o tamanho do array for 0
    if (!empresas || empresas.length === 0) {
        // sinaliza que não tem nenhuma empresa
        elsHtml.listaEmpresas.innerHTML = '<p>Nenhuma empresa encontrada.</p>';
        // desativa botão de proximo
        elsHtml.btnProxima.disabled = true;
        // desativa anterior se for a primeira pagina
        elsHtml.btnAnterior.disabled = paginaAtual === 1;
        return;
    }

    // passa por cada empresa
    empresas.forEach(empresa => {
        // cria uma div
        const div = document.createElement('div');
        // adiciona a classe empresa-item
        div.classList.add('empresa-item');
        // define o html da div
        div.innerHTML = `
            <h3>${empresa.nome}</h3>
            <p><strong>Categoria:</strong> ${empresa.categoria}</p>
            <p><strong>Descrição empresa:</strong> ${empresa.descricao}</p>
            <p><strong>Função:</strong> ${empresa.funcao}</p>
            <button class="btn-mais-info" onclick="maisInformacoes('${empresa.id}')">Mais informações</button>
        `;
        // coloca a div na lista de empresas
        elsHtml.listaEmpresas.appendChild(div);
    });

    elsHtml.spanAtual.textContent = `Página ${paginaAtual}`
}

/**
 * Analisa e desativa os botões de proximo e anterior
 * @param {Object} elsHtml Objeto contendo referencia aos elementos html
 * @param {Number} paginaAtual Número da pagina atual
 * @param {Number} qntPagina Quantidade de empresas que são mostradas por página
 */
const desativarBotoes = (elsHtml, paginaAtual, qntPagina) => {
    // botão proxima
    elsHtml.btnProxima.disabled = elsHtml.listaEmpresas.children.length < qntPagina;

    // botão anterior
    elsHtml.btnAnterior.disabled = paginaAtual === 1;
}

// função que vai rodar quando pagina carregar
document.addEventListener('DOMContentLoaded', async () => {    
    let paginaAtual = 1;
    let qntPagina   = 10;
    let filtro = '';

    // elementos html que vamos usar
    const elsHtml = {
        listaEmpresas : document.getElementById('listaEmpresas'),
        filtroSelect  : document.getElementById('filtroSelect'),
        btnFiltrar    : document.getElementById('btnFiltrar'),
        btnProxima    : document.getElementById('btnPaginaProxima'),
        btnAnterior   : document.getElementById('btnPaginaAnterior'),
        spanAtual     : document.getElementById('paginaAtual')
    };

    carregar(true);
    try {
        // pega a primeira página de empresas
        aplicarDados(await carregarEmpresas(), elsHtml, paginaAtual);
        // analisa e desativa botões
        desativarBotoes(elsHtml, paginaAtual, qntPagina);    
    } catch(err) {
        elsHtml.innerHTML = '<p>Erro na comunicação com o servidor.</p>'
    }
    carregar(false);    


    // clicando no botão proxima
    elsHtml.btnProxima.addEventListener('click', async () => {
        // aumenta número da página
        paginaAtual++;

        carregar(true);
        // se um filtro estiver aplicado
        if (filtro !== '') {
            // pesquisa proxima página com filtro
            aplicarDados(await carregarEmpresas({paginaAtual : paginaAtual, filtro : filtro}), elsHtml, paginaAtual);
        } else {
            // pesquisa proxima página sem filtro
            aplicarDados(await carregarEmpresas({paginaAtual : paginaAtual}), elsHtml, paginaAtual);
        }
        carregar(false);

        // analisa e desativa botões
        desativarBotoes(elsHtml, paginaAtual, qntPagina);    
        // volta pro topo
        scroll(0,0);
    });
    
    // clicando no botão anterior
    elsHtml.btnAnterior.addEventListener('click', async () => {
        // dimiui número da página
        paginaAtual--;

        carregar(true);
        // se um filtro estiver aplicado
        if (filtro !== '') {
            // pesquisa pagina anterior com filtro
            aplicarDados(await carregarEmpresas({paginaAtual : paginaAtual, filtro : filtro}), elsHtml, paginaAtual);
        } else {
            // pesquisa pagina anterior sem filtro
            aplicarDados(await carregarEmpresas({paginaAtual : paginaAtual}), elsHtml, paginaAtual);
        }
        // analisa e desativa botões
        desativarBotoes(elsHtml, paginaAtual, qntPagina);    
        // manda para o topo da página
        scroll(0,0);
        
        carregar(false);
    });
    

    elsHtml.btnFiltrar.addEventListener('click', async () => {
        carregar(true);
        // se o usuário apertou o filtrar sem um filtro selecionado e tinha usado um filtro antes
        if (elsHtml.filtroSelect.value === '' && filtro !== '') {
            // tira o filtro
            filtro = '';
            // pega os dados sem filtro
            aplicarDados(await carregarEmpresas(), elsHtml, paginaAtual);
        } else if (elsHtml.filtroSelect.value !== ''){
            paginaAtual = 1;
            // guarda o filtro selecionado
            filtro = elsHtml.filtroSelect.value;
            // pega os dados com filtro
            aplicarDados(await carregarEmpresas({ filtro : filtro }), elsHtml, paginaAtual);   
        }
        // analisa e desativa botões
        desativarBotoes(elsHtml, paginaAtual, qntPagina);   
        carregar(false);
    })
})