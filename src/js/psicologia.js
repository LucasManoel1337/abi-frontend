import { pegarUnisEstado } from "./servidor/universidadeHandler.js";
import { pegarHorariosOcupados, marcarHorario } from "./servidor/agendamentoHandler.js";
import { carregar } from './utilidades/carregando.js'
import { AGEN } from "./urls.js";

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

const criarCardTempo = (elsHtml, horaInicial, horaFinal, marcacoes, configBase) => {

    const criarCard = (horaString) => {
        // cria uma nova div
        const cardTempo = document.createElement('div');
        // faz o html do card
        cardTempo.innerHTML = `
            <h3>${horaString} <span class="${marcacoes.includes(horaString) ? 'bolinha-vermelha' : 'bolinha-verde'}"></span></h3>
            <p><strong>${marcacoes.includes(horaString) ? 'Indisponivel' : 'Disponivel'}</strong></p>
        `
        // se o tempo já foi marcado
        if (marcacoes.includes(horaString)) {
            cardTempo.classList.add('item-card', 'my-1', 'desativado');
            // se o tempo esta disponivel
        } else {
            // faz uma copia da configuração para evitar erro de referencia
            let copiaConfig = JSON.parse(JSON.stringify(configBase));
            // adiciona o horario marcado
            copiaConfig['horarioMarcado'] = horaString;

            // cria o botão de agendar, não crio no innerhtml para poder adicionar o eventListener
            const btn = document.createElement('button');
            btn.classList.add('btn-mais-info');
            btn.textContent = 'Agendar';
            btn.addEventListener('click', () => agendar(copiaConfig, elsHtml));

            // adiciona a classe de card ao div
            cardTempo.classList.add('item-card', 'my-1');
            cardTempo.appendChild(btn);
        }


        // coloca na lista
        elsHtml.listaHor.appendChild(cardTempo);
    }

    for (; horaInicial <= horaFinal; horaInicial++) {
        criarCard(`${horaInicial.toLocaleString('pt-br', { minimumIntegerDigits: 2, useGrouping: false })}:00`)

        if (horaInicial !== horaFinal) {
            criarCard(`${horaInicial.toLocaleString('pt-br', { minimumIntegerDigits: 2, useGrouping: false })}:30`)
        }
    }
}

const agendar = async ({
    categoria = 'psicologia',
    idUsuario = '',
    idUniversidade = '',
    nomeUniversidade = '',
    data = '',
    horarioMarcado = '',
    modelo = ''
} = obj, elsHtml) => {
    carregar(true);
    let obj = {
        categoria: categoria,
        idUsuario: idUsuario,
        idUniversidade: idUniversidade,
        nomeUniversidade: nomeUniversidade,
        data: data,
        horarioMarcado: horarioMarcado,
        modelo: modelo
    }

    await marcarHorario(obj);

    await resetar(elsHtml, obj.nomeUniversidade);

    carregar(false);

    window.location.replace(AGEN);
}

const resetar = async (elsHtml, nomeUni, mudouEstado = false) => {
    elsHtml.listaHor.innerHTML = "";

    if (mudouEstado) {
        return false;
    }

    if (elsHtml.inData.value === '' || elsHtml.selUni.value === '' || elsHtml.selMod.value === '') {
        return false;
    }

    if (!verificarDataInput(elsHtml.inData.value)) {
        return false;
    }
    
    const marcacoes = await pegarHorariosOcupados(elsHtml.selUni.value, elsHtml.inData.value, 'psicologia')

    // configurações que serão usadas para enviar os dados
    const configsBase = {
        idUsuario: localStorage.getItem('idUsuario'),
        idUniversidade: elsHtml.selUni.value,
        nomeUniversidade: nomeUni,
        data: elsHtml.inData.value,
    }

    criarCardTempo(elsHtml, 8, 18, marcacoes, configsBase);

    return true;
}

/**
 * Vai validar os inputs do usuário e determinar se o botão é clicavel ou não
 * @param {Object} elsHtml objeto contendo os elementos html da pagina
 */
const validarFiltros = (elsHtml) => {

    // se uma data ou universidade não tiver sido selecionada
    if (elsHtml.inData.value === '' || elsHtml.selUni.value === '' || elsHtml.selMod.value === '') {
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
        listaHor: document.getElementById('lista-horarios'),
        btnFiltrar: document.getElementById('btnFiltrar'),
        selUni: document.getElementById('selUni'),
        selEstado: document.getElementById('selEstado'),
        selMod : document.getElementById('selMod'),
        inData: document.getElementById('inDate'),
        blocoUni: document.getElementsByClassName('uni'),
        aviso: document.getElementById('aviso')
    };

    const universidades = {};
    let jaClicou = false;
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

            resetar(elsHtml, '', true);
            jaClicou = false;
            validarFiltros(elsHtml);

            try {
                const unis = await pegarUnisEstado(elsHtml.selEstado.value);

                // vai colocar as universidades disponiveis no select de universidades
                unis.forEach((uni, index) => {
                    universidades[uni.id] = uni.nome;
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

        validarFiltros(elsHtml);
    });

    // quando clicar no botão de ver horarios
    elsHtml.btnFiltrar.addEventListener('click', async () => {
        carregar(true);
        const marcacoes = await pegarHorariosOcupados(elsHtml.selUni.value, elsHtml.inData.value, 'psicologia')

        // configurações que serão usadas para enviar os dados
        const configsBase = {
            idUsuario: localStorage.getItem('idUsuario'),
            idUniversidade: elsHtml.selUni.value,
            nomeUniversidade: universidades[elsHtml.selUni.value],
            data: elsHtml.inData.value,
            modelo : elsHtml.selMod.value
        }

        elsHtml.listaHor.innerHTML = ""
        criarCardTempo(elsHtml, 8, 18, marcacoes, configsBase);

        jaClicou = true;
        carregar(false);
    })

    elsHtml.selUni.addEventListener('change', async () => {
        validarFiltros(elsHtml)
        carregar(true);
        if (jaClicou) {
            jaClicou = await resetar(elsHtml, universidades[elsHtml.selUni.value]);
        }
        carregar(false);
    })

    elsHtml.selMod.addEventListener('change', async () => {
        validarFiltros(elsHtml)
        carregar(true);
        if (jaClicou) {
            jaClicou = await resetar(elsHtml, universidades[elsHtml.selUni.value]);
        }
        carregar(false);
    })

    elsHtml.inData.addEventListener('change', async () => {
        validarFiltros(elsHtml)
        carregar(true);
        if (jaClicou) {
            jaClicou = await resetar(elsHtml, universidades[elsHtml.selUni.value]);
        }
        carregar(false);
    })
})