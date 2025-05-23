class NavbarAib extends HTMLDivElement {
    
    constructor() {
        super();
    }

    connectedCallback() {
        // adiciona a classe container fluid a div
        this.setAttribute('class', 'container-fluid');

        // nome da marca
        const marca = document.createElement('a');
        marca.setAttribute('class', 'navbar-brand');
        marca.textContent = 'ABI';

        // botão quando estiver na forma de celular
        const botaoCell = document.createElement('button');
        botaoCell.setAttribute('class', )
    }
}

customElements.define('navbar-aib', NavbarAib, { extends : 'div'});
