import { GUIA, SOBRE, INDEX } from "../urls.js";

const urlPermitidos = [GUIA, SOBRE, INDEX];

export const verificar = () => {

    // pega o id do usuário no localstorage
    let user = localStorage.getItem('idUsuario');
    
    
    // se o usuário estiver logado
    if (user) {
        // pega os botões de logar / deslogar
        const botaoLogout = document.getElementById('btnLogout');
        const botaoLogin = document.getElementById('btnLogin');
        // ativa o de deslogar e desativa o de logar
        botaoLogout.style.display = 'block';
        botaoLogin.style.display = 'none';
        return;
    }
    
    // se o usuário estiver em uma pagina permitida
    if (urlPermitidos.includes(window.location)) {
        // se o usuário não estiver logado oculta alguns links
        let linksParaDesativar = document.querySelector('nav').children;
        let num = 2;
        for (let i = 2, n = linksParaDesativar.length; i < n; i++) {
            linksParaDesativar[num].remove();
        }    
    }

    console.log(window.location);
    console.log(urlPermitidos);
    
}
