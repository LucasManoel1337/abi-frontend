import { GUIA, SOBRE, INDEX, INSTI } from "../urls.js";

// urls das paginas permitidas o usuário deslogado ficar
const urlPermitidos = [GUIA, SOBRE, INDEX, INSTI];

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
    if (urlPermitidos.includes(window.location.href)) {
        // se o usuário não estiver logado oculta alguns links
        let linksParaDesativar = document.querySelector('#appHeaderNavLinksContainer').children;
        let num = urlPermitidos.length - 1;
        for (let i = num, n = linksParaDesativar.length; i < n; i++) {
            linksParaDesativar[num].remove();
        }    
    } else {
        window.location.replace(INDEX);
    }
    
}
