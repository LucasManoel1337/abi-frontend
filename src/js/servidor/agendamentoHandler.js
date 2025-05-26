import { URL, AGEN, NOVOAGEN, HOROCUPADO } from "./constantes.js";

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
    } catch(err) {
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
            console.log(erro);
            throw new Error(erro.mensagem);
        }

        console.log(resposta);
    } catch (err) {
        console.log("Erro fazendo agendamento:", err);
    }

}