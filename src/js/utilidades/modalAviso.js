/**
 * Codigo feito exclusivamente pelo gemini
 * quando aplicado a uma pagina vai mostrar um aviso na primeira vez que o usuário entrar na pagina
 */

document.addEventListener('DOMContentLoaded', () => {
    // Verifica se o usuário já visitou o site antes. Se sim, não faz nada.
    if (localStorage.getItem('hasVisitedBefore')) {
        return;
    }

    // --- Se for a primeira visita, o script continua para criar e exibir o modal ---

    // 1. Define os estilos CSS do modal como um texto
    const styles = `
        .modal-overlay-dynamic {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.6);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 2000;
            opacity: 0;
            transition: opacity 0.3s ease;
        }
        .modal-content-dynamic {
            background-color: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.3);
            width: 90%;
            max-width: 500px;
            position: relative;
            transform: scale(0.9);
            transition: transform 0.3s ease;
        }
        .modal-content-dynamic h2 {
            color: #004466;
            margin-top: 0;
            margin-bottom: 15px;
        }
        .modal-content-dynamic p {
            margin-bottom: 10px;
            line-height: 1.6;
            color: #333;
        }
        .close-button-dynamic {
            position: absolute;
            top: 10px;
            right: 15px;
            font-size: 28px;
            font-weight: bold;
            color: #aaa;
            cursor: pointer;
            transition: color 0.2s;
        }
        .close-button-dynamic:hover {
            color: #333;
        }
    `;

    // 2. Define a estrutura HTML do modal como um texto
    const modalHtml = `
        <div class="modal-content-dynamic">
            <span class="close-button-dynamic">&times;</span>
            <h2>Aviso Importante</h2>
            <p>
                Este site é um protótipo desenvolvido para uma competição da organização ISBET.
            </p>
            <p>
                As informações e dados apresentados, com exceção da página "Guia", são <strong>fictícios</strong> e utilizados apenas para demonstração. As funcionalidades de agendamento são simulações e não interagem com serviços reais.
            </p>
            <p>
                Agradecemos a sua compreensão!
            </p>
        </div>
    `;

    // 3. Cria os elementos e os injeta no DOM
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = styles;
    styleSheet.id = "dynamic-modal-styles";
    document.head.appendChild(styleSheet);

    const modalOverlay = document.createElement("div");
    modalOverlay.className = "modal-overlay-dynamic";
    modalOverlay.innerHTML = modalHtml;
    document.body.appendChild(modalOverlay);
    
    // 4. Exibe o modal com uma transição suave
    setTimeout(() => {
        modalOverlay.style.opacity = '1';
        const modalContent = modalOverlay.querySelector('.modal-content-dynamic');
        if(modalContent) {
            modalContent.style.transform = 'scale(1)';
        }
    }, 10);

    // 5. Configura a funcionalidade de fechar o modal
    const closeModal = () => {
        modalOverlay.style.opacity = '0';
        const modalContent = modalOverlay.querySelector('.modal-content-dynamic');
        if(modalContent) {
             modalContent.style.transform = 'scale(0.9)';
        }
       
        // Remove os elementos do DOM após a transição
        setTimeout(() => {
             document.body.removeChild(modalOverlay);
             document.head.removeChild(styleSheet);
        }, 300); // Duração igual à da transição

        // Define a flag no localStorage para não exibir novamente
        localStorage.setItem('hasVisitedBefore', 'true');
    };

    const closeButton = modalOverlay.querySelector('.close-button-dynamic');
    closeButton.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', (event) => {
        if (event.target === modalOverlay) {
            closeModal();
        }
    });
});