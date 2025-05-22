import { URL, EMPRESA, LISTAREM } from "./constantes.js"

export const carregarEmpresas = async ({qtdPagina = 10, paginaAtual = 1, filtro = ''} = {}) => {
    try {
        let url; 

        // caso tenha um filtro definido
        if (filtro.trim() !== '') {
            // faz uma url com o filtro aplicado
            url = `${URL}/${EMPRESA}/${LISTAREM}/filtro?qnt=${qtdPagina}&pagina=${paginaAtual}&filtro=${encodeURIComponent(filtro)}`;
        } else {
            // faz uma url sem filtro
            url = `${URL}/${EMPRESA}/${LISTAREM}?qnt=${qtdPagina}&pagina=${paginaAtual}`;
        }

        // faz a requisição com o servidor
        const resposta = await fetch(url, { method : 'GET' });

        // se a resposta não estiver ok
        if (!resposta.ok) {
            // para o codigo e retorna um erro
            throw new Error(await resposta.json().message);
        }

        // retorna os dados da resposta
        return await resposta.json();
    } catch (err) {
        console.error("Erro ao carregar empresas:", err);
    }
}