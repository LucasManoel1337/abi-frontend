import { URL, EMPRESA, LISTAREM } from "./constantes.js"

const contruirUrl = (qtdPagina, paginaAtual, categoria, estado) => {
    let url;

    // se tem algum filtro
    if (categoria.trim() !== '' || estado.trim() !== '') {
        // url aponta para listar-empresas/filtro
        url = `${URL}/${EMPRESA}/${LISTAREM}/filtro?qnt=${qtdPagina}&pagina=${paginaAtual}`;

        // se tem categoria
        if (categoria.trim() !== '') {
            // adiciona categoria como parametro
            url += `&categoria=${categoria}`;
        }

        // se tem estado
        if (estado.trim() !== '') {
            // adiciona estado como parametro
            url += `&estado=${encodeURIComponent(estado)}`;
        }
    // se não tem filtro
    } else {
        // faz uma url sem filtro
        url = `${URL}/${EMPRESA}/${LISTAREM}?qnt=${qtdPagina}&pagina=${paginaAtual}`;
    }

    return url;
}

export const carregarEmpresas = async ({ qtdPagina = 10, paginaAtual = 1, categoria = '', estado = '' } = {}) => {
    try {
        const url = contruirUrl(qtdPagina, paginaAtual, categoria, estado);

        // faz a requisição com o servidor
        const resposta = await fetch(url, { method: 'GET' });

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