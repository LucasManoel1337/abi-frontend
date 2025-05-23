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
        div.classList.add('item-card');
        // define o html da div
        div.innerHTML = `
            <h3>${empresa.nome}</h3>
            <p><strong>Categoria:</strong> ${empresa.categoria}</p>
            <p><strong>Descrição empresa:</strong> ${empresa.descricao}</p>
            <p><strong>Função:</strong> ${empresa.funcao}</p>
            <p><strong>Estado:</strong> ${empresa.estado}</p>
            <p><strong>Muniípio:</strong> ${empresa.municipio}</p>
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

const colocarFiltrosSelect = async (elsHtml) => {
    try {
        // produção
        const resposta = await fetch('https://abi-frontend-mu.vercel.app/src/json/filtros.json');
        // dev
        // const resposta = await fetch('../json/filtros.json');
        
        if (!resposta.ok) {
            throw new Error(await resposta.json().message);
        }

        const json = await resposta.json();

        
        // faz um loop pelas categorias, categoria vai ser um array:
        // ['chave', 'valor']
        Object.entries(json.empresas.categorias).forEach(categoria => {
            // cria um elemento option
            const opt = document.createElement('option');
            // coloca o valor dele como a chave
            opt.setAttribute('value', `${categoria[0]}`);
            // coloca o texto como o valor
            opt.textContent = `${categoria[1]}`;

            elsHtml.selCategoria.appendChild(opt);
        })

        // mesmo loop acima só que para os estados
        Object.entries(json.estados).forEach(estado => {
            // cria um elemento option
            const opt = document.createElement('option');
            // coloca o valor dele como a chave
            opt.setAttribute('value', `${estado[0]}`);
            // coloca o texto como o valor
            opt.textContent = `${estado[1]}`;

            elsHtml.selEstado.appendChild(opt);
        })

    } catch(err) {
        console.log('erro ao carregar filtros do json:', err);
    }
}
 
// função que vai rodar quando pagina carregar
document.addEventListener('DOMContentLoaded', async () => {    
    // elementos html que vamos usar
    const elsHtml = {
        listaEmpresas : document.getElementById('listaEmpresas'),
        selCategoria  : document.getElementById('selCategoria'),
        selEstado  : document.getElementById('selEstado'),
        btnFiltrar    : document.getElementById('btnFiltrar'),
        btnProxima    : document.getElementById('btnPaginaProxima'),
        btnAnterior   : document.getElementById('btnPaginaAnterior'),
        spanAtual     : document.getElementById('paginaAtual')
    };

    
    let paginaAtual = 1;
    let qntPagina   = 10;
    
    carregar(true);
    // vai colocar os filtros nos selects
    await colocarFiltrosSelect(elsHtml);
    
    try {
        // pega a primeira página de empresas
        aplicarDados(await carregarEmpresas(), elsHtml, paginaAtual);
        // analisa e desativa botões
        desativarBotoes(elsHtml, paginaAtual, qntPagina);    
    } catch(err) {
        elsHtml.innerHTML = '<p>Erro na comunicação com o servidor.</p>'
    }
    carregar(false);    
    
    // filtros
    let categoria = '';
    let estado    = '';

    // clicando no botão proxima
    elsHtml.btnProxima.addEventListener('click', async () => {
        // aumenta número da página
        paginaAtual++;

        carregar(true);

        // faz um objeto de configuração
        let configRequisicao = {
            paginaAtual : paginaAtual
        };

        // se tem o filtro de categoria
        if (categoria !== '') {
            // adiciona categoria a configuração
            configRequisicao['categoria'] = categoria;
        }

        // se tem estado
        if (estado !== '') {
            // adiciona estado a configuração
            configRequisicao['estado'] = estado;
        }

        aplicarDados(await carregarEmpresas(configRequisicao), elsHtml, paginaAtual);

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
       
        // faz um objeto de configuração
        let configRequisicao = {
            paginaAtual : paginaAtual
        };

        // se tem o filtro de categoria
        if (categoria !== '') {
            // adiciona categoria a configuração
            configRequisicao['categoria'] = categoria;
        }

        // se tem estado
        if (estado !== '') {
            // adiciona estado a configuração
            configRequisicao['estado'] = estado;
        }

        aplicarDados(await carregarEmpresas(configRequisicao), elsHtml, paginaAtual);

        // analisa e desativa botões
        desativarBotoes(elsHtml, paginaAtual, qntPagina);    
        // manda para o topo da página
        scroll(0,0);
        
        carregar(false);
    });
    

    elsHtml.btnFiltrar.addEventListener('click', async () => {
        carregar(true);
        paginaAtual = 1;
        categoria = elsHtml.selCategoria.value;
        estado = elsHtml.selEstado.value;

        // coloca os filtros 
        let requisicaoConfig = {
            paginaAtual : paginaAtual,
            categoria   : categoria,
            estado      : estado,
        }
        
        aplicarDados(await carregarEmpresas(requisicaoConfig), elsHtml, paginaAtual);   

        // analisa e desativa botões
        desativarBotoes(elsHtml, paginaAtual, qntPagina);   
        carregar(false);
    })
})