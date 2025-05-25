import { pegarUnisEstado } from "./servidor/universidadeHandler.js";
import { carregar } from './utilidades/carregando.js'

const colocarFiltrosSelect = async (elsHtml) => {
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

        // Preencher Estado
        if (jsonFiltros.estados && elsHtml.selEstado) { //
            Object.entries(jsonFiltros.estados).forEach(([chave, valor]) => { //
                const opt = document.createElement('option');
                opt.setAttribute('value', chave);
                opt.textContent = valor;
                elsHtml.selEstado.appendChild(opt);
            });
        }

    } catch (err) {
        console.error('Erro ao carregar filtros para bolsas:', err);
        // Tratar erro na UI, se necessário
    }
};

/**
 * Vai mudar o display dos elementos de uma coleção html
 * @param {HTMLCollection} htmlCol Coleção de elementos html que vão ter o display mudado
 * @param {string} display Opção de display que vai ser colocada nos elementos
 */
const mudarDisplay = (htmlCol, display) => {
    // Faz um loop pelos elementos
    for (let i = 0, n = htmlCol.length; i < n; i++) {
        // bota display none em cada um para ficarem invisiveis
        htmlCol[i].style.display = display;
    }
}

/** Função feita pelo gemini
 * Analisa se a data que o usuário selecionou é valida
 * @param {String} dataInputString valor da data selecionada pelo usuário
 * @returns {Boolean} true se a data for valida, false se não
 */
const verificarDataInput = (dataInputString) => {
    // Cria um objeto Date para a data atual, zerando horas, minutos, segundos e milissegundos
    // para comparar apenas as datas (dia, mês, ano).
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    // O input date geralmente retorna a data no formato "AAAA-MM-DD".
    // Precisamos ajustar para o fuso horário local para evitar problemas com a meia-noite UTC.
    // Separamos ano, mês e dia da string.
    const partesData = dataInputString.split('-');
    const ano = parseInt(partesData[0], 10);
    const mes = parseInt(partesData[1], 10) - 1; // Mês em JavaScript é 0-indexado (0 = Janeiro, 11 = Dezembro)
    const dia = parseInt(partesData[2], 10);

    // Cria um objeto Date para a data do input.
    const dataInput = new Date(ano, mes, dia);
    dataInput.setHours(0, 0, 0, 0); // Zera o tempo para comparar apenas a data

    // Compara as datas
    if (dataInput < hoje) {
        return false; // A data do input é menor que a data atual
    }

    return true; // A data do input é igual ou maior que a data atual
}

/**
 * Vai validar os inputs do usuário e determinar se o botão é clicavel ou não
 * @param {Object} elsHtml objeto contendo os elementos html da pagina
 */
const validarFiltros = (elsHtml) => {

    // se uma data ou universidade não tiver sido selecionada
    if (elsHtml.inData.value === '' || elsHtml.selUni.value === '') {
        // não ta valido
        elsHtml.btnFiltrar.disabled = true;
        return;
    }
    
    // se a data selecionada não é valida
    if (!verificarDataInput(elsHtml.inData.value)) {
        // não ta valido
        elsHtml.btnFiltrar.disabled = true;
        // avisa que a data precisa ser no dia de hoje ou depois
        elsHtml.aviso.textContent = 'Data invalida, precisa ser hoje ou depois';
        elsHtml.aviso.style.display = 'block'
        return;
    }

    // se chegou aqui ta valido
    elsHtml.btnFiltrar.disabled = false;
    // certifica que o aviso suma caso tenha aparecido
    elsHtml.aviso.style.display = 'none';
}

// quando a pagina carregar
document.addEventListener('DOMContentLoaded', () => {
    // pega os elementos que vamos usar
    const elsHtml = {
        selEstado: document.getElementById('selEstadoPsicologia'),
        btnFiltrar: document.getElementById('btnFiltrarPsicologia'),
        selUni: document.getElementById('selUniPsicologia'),
        inData: document.getElementById('inDatePsicologia'),
        blocoUni: document.getElementsByClassName('uni'),
        aviso : document.getElementById('aviso')
    };

    // torna invisivel os elementos relacionados a universidade
    mudarDisplay(elsHtml.blocoUni, 'none');

    // torna invisivel o aviso
    elsHtml.aviso.style.display = 'none';

    // vai colocar os filtros no select
    colocarFiltrosSelect(elsHtml);


    // função que roda ao clicar no botão de filtro
    elsHtml.selEstado.addEventListener('change', async () => {
        carregar(true);

        // verifica se o usuário selecionou um estado
        if (elsHtml.selEstado.value !== '') {
            // TODO: terminar função de limpar as universidades
            // se tem universidades no selUni
            if (elsHtml.selUni.children.length > 1) {
                // faz um loop por cada filho a partir do segundo elemento de selUni
                for (let i = 1, j = 1, n = elsHtml.selUni.children.length; i < n; i++) {
                    // remove o elemento, assim limpando selUni
                    elsHtml.selUni.remove(j);
                }
            }

            try {
                const unis = await pegarUnisEstado(elsHtml.selEstado.value);

                // vai colocar as universidades disponiveis no select de universidades
                unis.forEach((uni, index) => {
                    // cria o option
                    let opt = document.createElement('option');
                    // atribui os valores ao option
                    opt.value = uni.id;
                    opt.textContent = uni.nome; 
                    opt.id = `uni${index}`
                    // coloca o option no select
                    elsHtml.selUni.appendChild(opt);
                })

                mudarDisplay(elsHtml.blocoUni, 'block');
            } catch (err) {
                console.error('Erro pegando universidades', err);
            }
        }

        carregar(false);
    })

    elsHtml.selUni.addEventListener('change', () => validarFiltros(elsHtml))
    elsHtml.inData.addEventListener('change', () => validarFiltros(elsHtml))
})