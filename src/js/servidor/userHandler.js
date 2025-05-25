/**
 * Arquivo contendo funções relacionadas a comunicação com o servidor na parte de login
 */

import { URL, CADASTRO, NOVO, LOGIN } from "./constantes.js";
/**
 * Vai fazer uma requisição http com o servidor, mandando um objeto json no body
 * @param {Object} conteudoJson Objeto que você quer mandar para o servidor
 * @param {String} url url que a requisição aponta
 * @returns retorna a resposta do servidor
 */
const mandarJsonHadler = async (conteudoJson, url) => {
    // faz uma requisição e guarda a resposta quando chegar
    return await fetch(url, {
        method  : 'POST',
        headers : {
            'Content-Type' : 'application/json'
        },
        body    : JSON.stringify(conteudoJson),
    });
}

/**
 * Vai criar um novo usuário
 * @param {String} usuario Nome de usuario do novo usuario
 * @param {String} senha Senha do novo usuario
 */
export const cadastrarNovoUsuario = async (usuario, senha) => {
    let conteudoJson = {id : 0, usuario : usuario, senha : senha};

     try {
        const conteudoResposta = await mandarJsonHadler(conteudoJson, `${URL}/${CADASTRO}/${NOVO}`);

        console.log(conteudoResposta);
        if (!conteudoResposta.ok) {
            throw new Error(`${await conteudoResposta.text()} ${await conteudoResposta.json()}`);
        }
        
        return conteudoResposta;
    } catch (err) {
        console.error(err);
    }

}

/**
 * Vai logar um usuário
 * @param {String} usuario Nome do usuário
 * @param {String} senha Senha do usuário
 */
export const loginUsuario = async (usuario, senha) => {
    let conteudoJson = {usuario : usuario, senha : senha};

    try {
        const conteudoResposta = await mandarJsonHadler(conteudoJson, `${URL}/${LOGIN}`);

        if (!conteudoResposta.ok) {
            throw new Error(`${await conteudoResposta.text()}`);
        }
    } catch (err) {
        console.error(err);
    }


    return await conteudoResposta.json();
}