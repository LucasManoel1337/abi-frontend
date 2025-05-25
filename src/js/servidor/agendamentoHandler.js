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