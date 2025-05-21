// pega o id do usuário no localstorage
let user = localStorage.getItem('idUsuario');

// pega os botões de logar / deslogar
let botaoLogout = document.getElementById('btnLogout');
let botaoLogin = document.getElementById('btnLogin');
        

export const verificar = () => {
    // se o usuário estiver logado
    if (user) {
        // ativa o de deslogar e desativa o de logar
        botaoLogout.style.display = 'block';
        botaoLogin.style.display = 'none';
        return;
    }
    
    // se o usuário não estiver logado oculta alguns links
    let linksParaDesativar = document.querySelector('nav').children;
    let num = 2;
    for (let i = 2, n = linksParaDesativar.length; i < n; i++) {
        linksParaDesativar[num].remove();
    }    
}
