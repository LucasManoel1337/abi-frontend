import { carregarBolsas } from "./servidor/bolsaHandler.js"; // Alterado para bolsaHandler.js
import { carregar } from './utilidades/carregando.js'; //

/**
 * Vai pegar as bolsas que foram pegas no banco e colocar no html
 * @param {Array} bolsas Objetos com informações das bolsas pegas no banco
 * @param {Object} elsHtml Objeto contendo referencias aos elementos html
 * @param {Number} paginaAtual Número da página atual
 * @returns
 */
const aplicarDadosBolsas = (bolsas, elsHtml, paginaAtual) => {
    // reseta a lista
    elsHtml.listaBolsas.innerHTML = ''; // Alterado para listaBolsas

    // se bolsas não existir ou o tamanho do array for 0 ou se houver um erro na resposta
    if (!bolsas || bolsas.length === 0 || bolsas.error) {
        // sinaliza que não tem nenhuma bolsa
        elsHtml.listaBolsas.innerHTML = `<p>${bolsas.error ? bolsas.message : 'Nenhuma bolsa encontrada.'}</p>`;
        // desativa botão de proximo
        elsHtml.btnProxima.disabled = true;
        // desativa anterior se for a primeira pagina
        elsHtml.btnAnterior.disabled = paginaAtual === 1;
        elsHtml.spanAtual.textContent = `Página ${paginaAtual}`;
        return;
    }

    // passa por cada bolsa
    bolsas.forEach(bolsa => {
        // cria uma div
        const div = document.createElement('div');
        div.classList.add('item-card');
        // define o html da div (ajustar campos conforme a estrutura de dados de 'bolsa')
        div.innerHTML = `
            <div class="d-flex justify-content-between"> 
                <h3>${bolsa.curso || 'Curso da Bolsa Indisponível'}</h3>
                <h3>${bolsa.valorDaBolsa}</h3>
            </div>
            <p><strong>Categoria:</strong> ${bolsa.categoria || 'N/A'}</p>
            <p><strong>Instituição:</strong> ${bolsa.nomeInsituicao || 'N/A'}</p>
            <p><strong>Estado:</strong> ${bolsa.estado || 'N/A'}</p>
            <p><strong>Município:</strong> ${bolsa.municipio || 'N/A'}</p>
            <p><strong>Modelo de Curso:</strong> ${bolsa.modeloDeCurso || 'N/A'}</p>
            <p><strong>Data de inicio:</strong> ${bolsa.dataInicio || 'N/A'}</p>
            <p><strong>Data de fim:</strong> ${bolsa.dataFim || 'N/A'}</p>
            <button class="btn-mais-info" onclick="maisInformacoesBolsa('${bolsa.id}')">Mais informações</button>
        `;
        // coloca a div na lista de bolsas
        elsHtml.listaBolsas.appendChild(div);
    });

    elsHtml.spanAtual.textContent = `Página ${paginaAtual}`;
};

// Função placeholder para mais informações da bolsa
window.maisInformacoesBolsa = (bolsaId) => {
    console.log("Mais informações para a bolsa ID:", bolsaId);
    // Implementar a lógica para mostrar mais informações, como um modal ou redirecionamento.
};

/**
 * Analisa e desativa os botões de proximo e anterior
 * @param {Object} elsHtml Objeto contendo referencia aos elementos html
 * @param {Number} paginaAtual Número da pagina atual
 * @param {Number} qntPagina Quantidade de bolsas que são mostradas por página
 */
const desativarBotoesPaginacaoBolsas = (elsHtml, paginaAtual, qntPagina) => {
    // botão proxima
    // Se o número de itens na lista é menor que a quantidade por página, desabilita "Próxima"
    const itensNaPagina = elsHtml.listaBolsas.children.length;
    const primeiraChildEhParagrafo = elsHtml.listaBolsas.firstChild && elsHtml.listaBolsas.firstChild.tagName === 'P';

    if (primeiraChildEhParagrafo || itensNaPagina < qntPagina) {
        elsHtml.btnProxima.disabled = true;
    } else {
        elsHtml.btnProxima.disabled = false;
    }

    // botão anterior
    elsHtml.btnAnterior.disabled = paginaAtual === 1;
};

const colocarFiltrosSelectBolsas = async (elsHtml) => {
    try {

        // produção
        const resposta = await fetch('https://abi-frontend-mu.vercel.app/src/json/filtros.json'); 

        // dev
        // const resposta = await fetch('../json/filtros.json');

        if (!resposta.ok) {
            const erroJson = await resposta.json();
            throw new Error(erroJson.message || `Erro ao carregar filtros: ${resposta.status}`);
        }

        const jsonFiltros = await resposta.json(); //

        // Preencher Categoria
        if (jsonFiltros.bolsas.categorias && elsHtml.selCategoriaBolsa) { //
            Object.entries(jsonFiltros.bolsas.categorias).forEach(([chave, valor]) => { //
                const opt = document.createElement('option');
                opt.setAttribute('value', chave);
                opt.textContent = valor;
                elsHtml.selCategoriaBolsa.appendChild(opt);
            });
        }

        // Preencher Estado
        if (jsonFiltros.estados && elsHtml.selEstadoBolsa) { //
            Object.entries(jsonFiltros.estados).forEach(([chave, valor]) => { //
                const opt = document.createElement('option');
                opt.setAttribute('value', chave);
                opt.textContent = valor;
                elsHtml.selEstadoBolsa.appendChild(opt);
            });
        }

        // preenche select bolsas
        if (jsonFiltros.bolsas.modelosDeCurso && elsHtml.selModeloCurso) {
            Object.entries(jsonFiltros.bolsas.modelosDeCurso).forEach(([chave, valor]) => {
                const opt = document.createElement('option');
                opt.setAttribute('value', chave);
                opt.textContent = valor;
                elsHtml.selModeloCurso.appendChild(opt);
            });
        }

    } catch(err) {
        console.error('Erro ao carregar filtros para bolsas:', err);
        // Tratar erro na UI, se necessário
    }
};

// função que vai rodar quando pagina carregar
document.addEventListener('DOMContentLoaded', async () => {
    // elementos html que vamos usar
    const elsHtml = {
        listaBolsas : document.getElementById('listaBolsas'), 
        selCategoriaBolsa  : document.getElementById('selCategoriaBolsa'), // Novo ID
        selEstadoBolsa  : document.getElementById('selEstadoBolsa'), // Novo ID
        selModeloCurso : document.getElementById('selModeloCurso'), // Novo ID para o filtro adicional
        btnFiltrarBolsas    : document.getElementById('btnFiltrarBolsas'), // Novo ID
        btnProxima    : document.getElementById('btnPaginaProximaBolsas'), // Novo ID
        btnAnterior   : document.getElementById('btnPaginaAnteriorBolsas'), // Novo ID
        spanAtual     : document.getElementById('paginaAtualBolsas') // Novo ID
    };

    // Verificar se todos os elementos essenciais foram encontrados
    for (const key in elsHtml) {
        if (!elsHtml[key]) {
            console.warn(`Elemento HTML não encontrado: ${key}. A página de bolsas pode não funcionar como esperado.`);
            // Poderia desabilitar funcionalidades ou mostrar uma mensagem ao usuário
            // if (key === 'listaBolsas') elsHtml.listaBolsas = { innerHTML: '' }; // Evitar erros de null reference
        }
    }


    let paginaAtual = 1;
    let qntPagina   = 10; // Quantidade de bolsas por página

    carregar(true); //
    // vai colocar os filtros nos selects
    if (elsHtml.selCategoriaBolsa && elsHtml.selEstadoBolsa && elsHtml.selModeloCurso) {
        await colocarFiltrosSelectBolsas(elsHtml);
    }

    try {
        // pega a primeira página de bolsas
        const dadosIniciaisBolsas = await carregarBolsas({ qntPagina, paginaAtual });
        if (elsHtml.listaBolsas) {
            aplicarDadosBolsas(dadosIniciaisBolsas, elsHtml, paginaAtual);
            desativarBotoesPaginacaoBolsas(elsHtml, paginaAtual, qntPagina);
        }
    } catch(err) {
        if (elsHtml.listaBolsas) {
            elsHtml.listaBolsas.innerHTML = '<p>Erro na comunicação com o servidor ao carregar bolsas.</p>';
        }
        console.error("Erro inicial ao carregar bolsas:", err);
    }
    carregar(false); //

    // filtros
    let categoriaFiltro = '';
    let estadoFiltro    = '';
    let modeloCursoFiltro = '';

    // clicando no botão proxima
    if (elsHtml.btnProxima) {
        elsHtml.btnProxima.addEventListener('click', async () => {
            paginaAtual++;
            carregar(true); //

            let configRequisicao = {
                qntPagina,
                paginaAtual,
                categoria: categoriaFiltro,
                estado: estadoFiltro,
                modeloDeCurso: modeloCursoFiltro
            };

            const dadosBolsas = await carregarBolsas(configRequisicao);
            aplicarDadosBolsas(dadosBolsas, elsHtml, paginaAtual);
            desativarBotoesPaginacaoBolsas(elsHtml, paginaAtual, qntPagina);
            carregar(false); //
            scroll(0,0);
        });
    }

    // clicando no botão anterior
    if (elsHtml.btnAnterior) {
        elsHtml.btnAnterior.addEventListener('click', async () => {
            paginaAtual--;
            carregar(true); //

            let configRequisicao = {
                qntPagina,
                paginaAtual,
                categoria: categoriaFiltro,
                estado: estadoFiltro,
                modeloDeCurso: modeloCursoFiltro
            };

            const dadosBolsas = await carregarBolsas(configRequisicao);
            aplicarDadosBolsas(dadosBolsas, elsHtml, paginaAtual);
            desativarBotoesPaginacaoBolsas(elsHtml, paginaAtual, qntPagina);
            carregar(false); //
            scroll(0,0);
        });
    }

    // clicando no botão de filtrar
    if (elsHtml.btnFiltrarBolsas) {
        elsHtml.btnFiltrarBolsas.addEventListener('click', async () => {
            carregar(true); //
            paginaAtual = 1;
            categoriaFiltro = elsHtml.selCategoriaBolsa ? elsHtml.selCategoriaBolsa.value : '';
            estadoFiltro = elsHtml.selEstadoBolsa ? elsHtml.selEstadoBolsa.value : '';
            modeloCursoFiltro = elsHtml.selModeloCurso ? elsHtml.selModeloCurso.value : '';

            let requisicaoConfig = {
                qntPagina,
                paginaAtual,
                categoria: categoriaFiltro,
                estado: estadoFiltro,
                modeloDeCurso: modeloCursoFiltro
            };

            const dadosBolsas = await carregarBolsas(requisicaoConfig);
            aplicarDadosBolsas(dadosBolsas, elsHtml, paginaAtual);
            desativarBotoesPaginacaoBolsas(elsHtml, paginaAtual, qntPagina);
            carregar(false); //
        });
    }
});