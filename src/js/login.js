/**
 * Script que controla a pagina de login
 */
import  { loginUsuario } from './servidor/userHandler.js'
import { carregar } from './utilidades/carregando.js';
import { INDEX } from './urls.js';

// pega os elementos html que vamos usar
const botaoLogin     = document.getElementById('btnLogin');
const inputEmail     = document.getElementById('inEmail');
const inputSenha     = document.getElementById('inSenha');

// Evento de clicar no botão login
botaoLogin.addEventListener('click', async () => {
    // Valida se há texto nos inputs
    if (inputEmail.value !== '' && inputSenha.value !== '') {
        // indica ao usuário que a requisição está sendo feita
        carregar(true);
        
        try {
            // chama função que loga usuário
            let resposta = await loginUsuario(inputEmail.value, inputSenha.value);
    
            localStorage.setItem('idUsuario', resposta.id);
    
            window.location.replace(INDEX);
        } catch(err) {
            carregar(false);
        }
    }
});