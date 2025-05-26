import { buscarAgendamento, cancelarAgendamento } from "./servidor/agendamentoHandler.js";
import { carregar } from "./utilidades/carregando.js";

const cancelar = async (idAgendamento) => {
    carregar(true);
    try {
        await cancelarAgendamento(idAgendamento);
        location.reload();
    } catch (err) {
        carregar(false);
        alert('Erro ao cancelar agendamento.');
    }
}


/**
 * Vai fazer um card para cada agendamento e colocar na div lista-horarios
 * @param {Object} elsHtml Objeto contendo elementos html da pagina
 * @param {Array} agendamentos Array de objetos contendo informação de cada agendamento
 */
const fazerCardAgendamento = (elsHtml, agendamentos) => {
    /**
     * estrutura agendamento
     * categoria
     * data
     * horarioMarcado
     * id
     * idUniversidade
     * idUsuario
     * modelo
     * nomeUniversidade
     */
     // se não tem agendamentos
    if (!agendamentos || agendamentos.length === 0) {
        elsHtml.listaItems.innerHTML = '<p>Nenhum agendamento encontrado.</p>';
        return;
    }
    // passa por cada agendamento
    agendamentos.forEach(agendamento => {
        // cria uma div
        const div = document.createElement('div');
        // adiciona a classe item-card
        div.classList.add('item-card', 'my-3');
        // define o html da div
        div.innerHTML = `
        <h3>${agendamento.categoria.charAt(0).toUpperCase() + agendamento.categoria.slice(1)}</h3>
        <p><strong>Universidade:</strong> ${agendamento.nomeUniversidade}</p>
        <p><strong>Data:</strong> ${agendamento.data}</p>
        <p><strong>Horário:</strong> ${agendamento.horarioMarcado}</p>
        ${agendamento.modelo ? `<p><strong>Modelo:</strong> ${agendamento.modelo}</p>` : ''}
        `;

        // se o modelo do agendamento for online
        if (agendamento.modelo === 'Online') {
            const btnInfo = document.createElement('button');
            btnInfo.classList.add('btn-mais-info');
            btnInfo.textContent = 'Mais informações';
            div.appendChild(btnInfo);
        }

        // cria o botão de cancelar
        const btn = document.createElement('button');
        // adiciona a classe btn-cancelar
        btn.classList.add('btn-cancelar');
        // define o texto do botão
        btn.textContent = 'Cancelar';
        btn.addEventListener('click', () => cancelar(agendamento.id));
        div.appendChild(btn);
        // coloca a div na lista de horarios
        elsHtml.listaItems.appendChild(div);
    });
}

document.addEventListener('DOMContentLoaded', async () => {
    carregar(true);

    // elementos html que vamos usar
    const elsHtml = {
        listaItems : document.getElementById('lista-horarios')
    };

    // id do usuário
    const idUsuario = localStorage.getItem('idUsuario');

    // pega os agendamentos do usuário
    const agendamentos = await buscarAgendamento(idUsuario);

    fazerCardAgendamento(elsHtml, agendamentos);
    carregar(false);
})