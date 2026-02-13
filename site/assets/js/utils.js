// Funções utilitárias gerais

// Smooth scroll para links âncora
document.addEventListener('DOMContentLoaded', function() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

// Formatação de moeda
function formatarMoeda(valor) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(valor);
}

// Formatação de número
function formatarNumero(numero) {
    return new Intl.NumberFormat('pt-BR').format(numero);
}

// Formatação de data
function formatarData(data) {
    return new Intl.DateFormat('pt-BR').format(new Date(data));
}

// Copiar texto para clipboard
function copiarTexto(texto) {
    navigator.clipboard.writeText(texto).then(() => {
        // Feedback visual
        console.log('Texto copiado!');
    });
}

// Validar email
function validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

// Gerar ID único
function gerarId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}
