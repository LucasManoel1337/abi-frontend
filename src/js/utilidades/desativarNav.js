document.addEventListener('DOMContentLoaded', () => {
    let user = localStorage.getItem('idUsuario');
    // se o usuário estiver logado
    if (user) {
        return;
    }
    
    let linksParaDesativar = document.querySelector('nav').children;

    let num = 2;
    for (let i = 2, n = linksParaDesativar.length; i < n; i++) {
        linksParaDesativar[num].remove();
    }   
})