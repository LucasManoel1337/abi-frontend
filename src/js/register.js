import { cadastrarNovoUsuario } from './servidor/userHandler.js'
import { carregar } from './utilidades/carregando.js'
import { LOGIN } from './urls.js';

// pega os elementos html que vamos usar
const botaoCadastrar = document.getElementById('btnCadastrar');
const inputEmail     = document.getElementById('inEmail');
const inputSenha     = document.getElementById('inSenha');
const inputConSenha  = document.getElementById('inConSenha');

/**
 * Vai validar os inputs da tela de cadastro
 * @returns {boolean} falso se estiver invalido, true se estiver valido
 */
const validarInput = () => {
    // se email esta vazio
    if (inputEmail.value === '') {
        alert('Campo email em branco');
        return false;
    }

    // se senha esta vazio
    if (inputSenha.value === '') {
        alert('Campo senha em branco');
        return false;
    }

    // se confirmar senha está vazio
    if (inputConSenha.value === '') {
        alert('Campo confirmar senha em branco');
        return false;
    }

    // analisa se senha e confirmar senhas são iguais
    if (inputSenha.value !== inputConSenha.value) {
        alert('Confirmar senha tem que ser igual a senha');
        return false;
    }

    return true;
}

// evento de clicar no botão cadastrar
botaoCadastrar.addEventListener('click', async () => {
    
    // valida se os inputs estão validos
    if (validarInput()) {
        carregar(true);
        
        try {
            await cadastrarNovoUsuario(inputEmail.value, inputSenha.value);
            window.location.replace(LOGIN);
        } catch (err) {
            console.error(err);
            alert('erro ao cadastrar novo usuário:');
            carregar(false);
        }
    }
});