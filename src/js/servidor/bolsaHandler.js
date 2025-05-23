import { URL, BOLSAS, LISTARBOL } from "./constantes.js"; 

/**
 * Vai fazer a url da requisição
 */
const construirUrlBolsas = (qtdPagina, paginaAtual, categoria, estado, modeloDeCurso) => {
    let url;

    // se tem algum filtro
    if (categoria.trim() !== '' || estado.trim() !== '' || modeloDeCurso.trim() !== '') {
        // url aponta para listar-bolsas/filtro
        url = `${URL}/${BOLSAS}/${LISTARBOL}/filtro?qnt=${qtdPagina}&pagina=${paginaAtual}`; //

        // se tem categoria
        if (categoria.trim() !== '') {
            // adiciona categoria como parametro
            url += `&categoria=${encodeURIComponent(categoria)}`;
        }

        // se tem estado
        if (estado.trim() !== '') {
            // adiciona estado como parametro
            url += `&estado=${encodeURIComponent(estado)}`;
        }

        // se tem modelo de curso
        if (modeloDeCurso.trim() !== '') {
            // adiciona modeloDeCurso como parametro
            url += `&modeloDeCurso=${encodeURIComponent(modeloDeCurso)}`;
        }
    // se não tem filtro
    } else {
        // faz uma url sem filtro
        url = `${URL}/${BOLSAS}/${LISTARBOL}?qnt=${qtdPagina}&pagina=${paginaAtual}`;
    }

    return url;
}

export const carregarBolsas = async ({ 
    qtdPagina = 10, 
    paginaAtual = 1, 
    categoria = '',
    estado = '', 
    modeloDeCurso = '' 
} = {}) => {

    try {
        const url = construirUrlBolsas(qtdPagina, paginaAtual, categoria, estado, modeloDeCurso);

        // faz a requisição com o servidor
        const resposta = await fetch(url, { method: 'GET' });

        // se a resposta não estiver ok
        if (!resposta.ok) {
            // para o codigo e retorna um erro
            const erroJson = await resposta.json();
            throw new Error(erroJson.message || `Erro ${resposta.status} ao buscar bolsas.`);
        }

        // retorna os dados da resposta
        return await resposta.json();
    } catch (err) {
        console.error("Erro ao carregar bolsas:", err);
        // Retornar um objeto com uma propriedade de erro pode ser útil para o front-end tratar
        return { error: true, message: err.message };
    }
}