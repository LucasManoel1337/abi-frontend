/**
 * Autor     : Kayo Victor
 * Descrição : Vai impossibilitar interação com a pagina atual, e colocar um icone de carregamento. Quando o servidor retornar uma resposta vai desaparecer
 */
import { CSSCARREGAR } from "../urls.js";
/**
 * 
 * @param {Boolean} iniciar 
 */
export const carregar = (iniciar) => {
    // se vai começar a carregar
    if (iniciar) {
        const body = document.getElementsByTagName('body')[0]
        const head = document.getElementsByTagName('head')[0];
        const div = document.createElement('div');
        const link = document.createElement('link');

        // configura o arquivo css na pagina
        link.rel = 'stylesheet';
        link.href = CSSCARREGAR;
        link.id = 'css-carregar';

        // bota classe que adiciona uma animação
        div.classList.add('fade-in');
        // bota um id para a gente pegar a div de novo depois
        div.id = 'div-carregamento'
        // define o html, terá um spinner do bootstrap dentro dele
        div.innerHTML = `
            <div class="spinner-border text-primary" role="status"></div>  
            <span>Carregando...</span>
        ` 

        // bota o arquivo css primeiro
        head.appendChild(link);
        // coloca a div no body
        body.appendChild(div);
    }

    // se acabou o carregamento
    if (!iniciar) {
        const link = document.getElementById('css-carregar');
        const div = document.getElementById('div-carregamento');

        link.remove();
        div.remove();
    }
}