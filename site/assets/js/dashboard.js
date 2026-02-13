// Dashboard - Funcionalidades

document.addEventListener('DOMContentLoaded', function() {
    
    // Verificar se usuário está logado
    const user = JSON.parse(localStorage.getItem('midiah_user'));
    if (!user) {
        window.location.href = '../login.html';
        return;
    }
    
    // Atualizar informações do usuário
    const userName = document.querySelector('.user-name');
    const userRole = document.querySelector('.user-role');
    if (userName && user.nome) {
        userName.textContent = user.nome;
    }
    if (userRole && user.empresa) {
        userRole.textContent = user.empresa;
    }
    
    // Animação dos números das estatísticas
    animarNumeros();
    
    // Atualizar status em tempo real (simulado)
    atualizarStatusTempo();
    
    // Handler do botão de notificações
    const notificationBell = document.querySelector('.notification-bell');
    if (notificationBell) {
        notificationBell.addEventListener('click', function() {
            alert('Notificações:\n\n✅ Anúncio "Promoção Verão" aprovado\n💰 Pagamento de R$100 confirmado\n⏰ Plano expira em 2 dias');
        });
    }
    
    // Handler do upload
    const uploadBox = document.querySelector('.upload-box');
    if (uploadBox) {
        uploadBox.addEventListener('click', function() {
            alert('Funcionalidade de upload em desenvolvimento!\n\nEm breve você poderá arrastar e soltar seus arquivos aqui.');
        });
    }
    
});

// Animar contadores numéricos
function animarNumeros() {
    const statValues = document.querySelectorAll('.stat-value');
    
    statValues.forEach(stat => {
        const text = stat.textContent;
        const numero = parseInt(text.replace(/\D/g, ''));
        
        if (!isNaN(numero) && numero > 0) {
            let atual = 0;
            const incremento = numero / 50;
            const duracao = 1000;
            const intervalo = duracao / 50;
            
            const timer = setInterval(() => {
                atual += incremento;
                if (atual >= numero) {
                    atual = numero;
                    clearInterval(timer);
                }
                
                // Manter formatação original
                if (text.includes('.')) {
                    stat.firstChild.textContent = formatarNumero(Math.floor(atual));
                } else if (text.includes('R$')) {
                    stat.firstChild.textContent = 'R$ ' + formatarNumero(Math.floor(atual));
                } else {
                    stat.firstChild.textContent = Math.floor(atual).toString().padStart(2, '0');
                }
            }, intervalo);
        }
    });
}

function formatarNumero(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

// Atualizar status em tempo real (simulado)
function atualizarStatusTempo() {
    setInterval(() => {
        const statusDot = document.querySelector('.status-dot');
        if (statusDot) {
            // Simulação de status online/offline
            const online = Math.random() > 0.1; // 90% chance de estar online
            if (online) {
                statusDot.classList.add('online');
            } else {
                statusDot.classList.remove('online');
            }
        }
    }, 5000);
}

// Logout
function logout() {
    localStorage.removeItem('midiah_user');
    window.location.href = '../login.html';
}
