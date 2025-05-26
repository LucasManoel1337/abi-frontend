import { URL, AGEN, NOVOAGEN, HOROCUPADO, BUSAGEN, CANCELARAGEN } from "./constantes.js";

export const pegarHorariosOcupados = async (idUni, data, categoria) => {
    try {
        // faz a requisição e guarda em respsota
        const resposta = await fetch(`${URL}/${AGEN}/${HOROCUPADO}?idUniversidade=${idUni}&data=${encodeURIComponent(data)}&categoria=${encodeURIComponent(categoria)}`);

        // retorna erro
        if (!resposta.ok) {
            throw new Error(await resposta.json().message);
        }

        // retorna resposta
        return resposta.json();
    } catch (err) {
        console.error('erro pegando agendamentos:', err);
    }
}

export const marcarHorario = async ({
    categoria = 'psicologia',
    idUsuario = '',
    idUniversidade = '',
    nomeUniversidade = '',
    data = '',
    horarioMarcado = '',
    modelo = 'presencial'
} = {}) => {

    try {
        // faz a url da requisição
        const url = `${URL}/${AGEN}/${NOVOAGEN}?idUniversidade=${idUniversidade}&data=${encodeURIComponent(data)}&categoria=${encodeURIComponent(categoria)}&nomeUniversidade=${encodeURIComponent(nomeUniversidade)}&idUsuario=${idUsuario}&horarioMarcado=${horarioMarcado}&modelo=${modelo}`;
        // faz a requisição e guarda em respsota
        const resposta = await fetch(url, {
            method: 'POST'
        });

        if (!resposta.ok) {
            let erro = await resposta.text();
            throw new Error(erro.mensagem);
        }

    } catch (err) {
        console.error("Erro fazendo agendamento:", err);
    }
}

export const buscarAgendamento = async (idUser) => {
    try {
        const url = `${URL}/${AGEN}/${BUSAGEN}/${idUser}`;

        const resposta = await fetch(url, {
            method: 'GET'
        });

        if (!resposta.ok) {
            throw new Error(await resposta.text());
        }

        return await resposta.json();
    } catch (err) {
        console.error("Erro buscando agendamento:", err);
    }
}

export const cancelarAgendamento = async (idAgendamento) => {
    try {
        const url = `${URL}/${AGEN}/${CANCELARAGEN}/${idAgendamento}`;

        const resposta = await fetch(url, {
            method: 'DELETE'
        });

        if (!resposta.ok) {
            throw new Error(await resposta.text());
        }
    } catch (err) {
        console.error("Erro buscando agendamento:", err);
    }
}