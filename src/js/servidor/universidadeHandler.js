import { URL, UNIS, BUSUNIS } from "./constantes.js";

/**
 * Vai pegar as universidades especificas de um estado
 * @param {String} estado Estado desejado
 */
export const pegarUnisEstado = async (estado) => {
    // pega as universidades disponiveis no estado 
    const resposta = await fetch(`${URL}/${UNIS}/${BUSUNIS}?estado=${estado}`);

    // retorna um erro se não estiver ok
    if (!resposta.ok) {
        throw new Error(await resposta.json().message);
    }

    // retorna a resposta do servidor
    return resposta.json();
}