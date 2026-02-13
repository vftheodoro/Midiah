// Autenticação - Login e Cadastro

document.addEventListener('DOMContentLoaded', function() {
    
    // Login Form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            // Verificar se é admin
            if (email === 'admin' && password === 'admin') {
                localStorage.setItem('midiah_user', JSON.stringify({
                    email: 'admin@midiah.com',
                    nome: 'Administrador',
                    tipo: 'admin'
                }));
                
                const btn = loginForm.querySelector('button[type="submit"]');
                btn.innerHTML = '✓ Entrando como Admin...';
                btn.disabled = true;
                
                setTimeout(() => {
                    window.location.href = 'admin/dashboard.html';
                }, 800);
                return;
            }
            
            // Simulação de login cliente
            if (email && password) {
                // Salvar "sessão" simulada
                localStorage.setItem('midiah_user', JSON.stringify({
                    email: email,
                    nome: 'Autoposto Guaricana',
                    tipo: 'cliente'
                }));
                
                // Feedback visual
                const btn = loginForm.querySelector('button[type="submit"]');
                btn.innerHTML = '✓ Entrando...';
                btn.disabled = true;
                
                // Redirecionar após delay
                setTimeout(() => {
                    window.location.href = 'cliente/dashboard.html';
                }, 800);
            }
        });
    }
    
    // Cadastro Form
    const cadastroForm = document.getElementById('cadastroForm');
    if (cadastroForm) {
        cadastroForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const nome = document.getElementById('nome').value;
            const email = document.getElementById('email').value;
            const empresa = document.getElementById('empresa').value;
            const whatsapp = document.getElementById('whatsapp').value;
            const password = document.getElementById('password').value;
            const termos = document.getElementById('termos').checked;
            
            // Validações básicas
            if (!termos) {
                alert('Você precisa aceitar os Termos de Uso');
                return;
            }
            
            if (password.length < 6) {
                alert('A senha deve ter no mínimo 6 caracteres');
                return;
            }
            
            // Simulação de cadastro
            if (nome && email && empresa && password) {
                // Salvar "usuário" simulado
                localStorage.setItem('midiah_user', JSON.stringify({
                    nome: nome,
                    email: email,
                    empresa: empresa,
                    whatsapp: whatsapp,
                    tipo: 'cliente'
                }));
                
                // Feedback visual
                const btn = cadastroForm.querySelector('button[type="submit"]');
                btn.innerHTML = '✓ Conta criada!';
                btn.disabled = true;
                
                // Redirecionar após delay
                setTimeout(() => {
                    window.location.href = 'cliente/dashboard.html';
                }, 800);
            }
        });
        
        // Máscara de WhatsApp
        const whatsappInput = document.getElementById('whatsapp');
        if (whatsappInput) {
            whatsappInput.addEventListener('input', function(e) {
                let value = e.target.value.replace(/\D/g, '');
                if (value.length <= 11) {
                    value = value.replace(/^(\d{2})(\d)/g, '($1) $2');
                    value = value.replace(/(\d)(\d{4})$/, '$1-$2');
                }
                e.target.value = value;
            });
        }
    }
    
});
