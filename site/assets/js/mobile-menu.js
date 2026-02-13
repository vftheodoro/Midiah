// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', function() {
    // Criar botão de menu mobile se não existir
    const topbar = document.querySelector('.topbar') || document.querySelector('.admin-header');
    
    if (topbar && window.innerWidth <= 968) {
        // Verificar se já existe botão
        let mobileToggle = document.querySelector('.mobile-menu-toggle, .admin-mobile-toggle');
        
        if (!mobileToggle) {
            // Criar botão
            mobileToggle = document.createElement('button');
            mobileToggle.className = topbar.classList.contains('admin-header') ? 'admin-mobile-toggle' : 'mobile-menu-toggle';
            mobileToggle.innerHTML = '<i data-lucide="menu"></i>';
            mobileToggle.setAttribute('aria-label', 'Abrir menu');
            
            // Inserir no início da topbar
            const firstChild = topbar.firstElementChild;
            if (firstChild) {
                topbar.insertBefore(mobileToggle, firstChild);
            } else {
                topbar.appendChild(mobileToggle);
            }
            
            // Inicializar ícone Lucide
            if (window.lucide) {
                lucide.createIcons();
            }
        }
        
        // Selecionar sidebar
        const sidebar = document.querySelector('.sidebar, .admin-sidebar');
        
        if (sidebar) {
            // Toggle menu
            mobileToggle.addEventListener('click', function(e) {
                e.stopPropagation();
                sidebar.classList.toggle('active');
                
                // Alternar ícone
                const icon = mobileToggle.querySelector('i');
                if (sidebar.classList.contains('active')) {
                    icon.setAttribute('data-lucide', 'x');
                    mobileToggle.setAttribute('aria-label', 'Fechar menu');
                } else {
                    icon.setAttribute('data-lucide', 'menu');
                    mobileToggle.setAttribute('aria-label', 'Abrir menu');
                }
                
                // Atualizar ícone
                if (window.lucide) {
                    lucide.createIcons();
                }
            });
            
            // Fechar menu ao clicar fora
            document.addEventListener('click', function(e) {
                if (sidebar.classList.contains('active') && 
                    !sidebar.contains(e.target) && 
                    !mobileToggle.contains(e.target)) {
                    sidebar.classList.remove('active');
                    
                    const icon = mobileToggle.querySelector('i');
                    icon.setAttribute('data-lucide', 'menu');
                    mobileToggle.setAttribute('aria-label', 'Abrir menu');
                    
                    if (window.lucide) {
                        lucide.createIcons();
                    }
                }
            });
            
            // Fechar menu ao clicar em link (mobile)
            const navLinks = sidebar.querySelectorAll('a');
            navLinks.forEach(link => {
                link.addEventListener('click', function() {
                    if (window.innerWidth <= 968) {
                        sidebar.classList.remove('active');
                        
                        const icon = mobileToggle.querySelector('i');
                        icon.setAttribute('data-lucide', 'menu');
                        mobileToggle.setAttribute('aria-label', 'Abrir menu');
                        
                        if (window.lucide) {
                            lucide.createIcons();
                        }
                    }
                });
            });
        }
    }
    
    // Criar overlay para mobile
    if (window.innerWidth <= 968) {
        const sidebar = document.querySelector('.sidebar, .admin-sidebar');
        if (sidebar && !document.querySelector('.mobile-overlay')) {
            const overlay = document.createElement('div');
            overlay.className = 'mobile-overlay';
            document.body.appendChild(overlay);
            
            overlay.addEventListener('click', function() {
                sidebar.classList.remove('active');
                overlay.classList.remove('active');
                
                const mobileToggle = document.querySelector('.mobile-menu-toggle, .admin-mobile-toggle');
                if (mobileToggle) {
                    const icon = mobileToggle.querySelector('i');
                    icon.setAttribute('data-lucide', 'menu');
                    mobileToggle.setAttribute('aria-label', 'Abrir menu');
                    
                    if (window.lucide) {
                        lucide.createIcons();
                    }
                }
            });
        }
    }
    
    // Atualizar ao redimensionar
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            const sidebar = document.querySelector('.sidebar, .admin-sidebar');
            const mobileToggle = document.querySelector('.mobile-menu-toggle, .admin-mobile-toggle');
            
            if (window.innerWidth > 968) {
                // Desktop: remover classe active e esconder botão
                if (sidebar) {
                    sidebar.classList.remove('active');
                }
                if (mobileToggle) {
                    mobileToggle.style.display = 'none';
                }
            } else {
                // Mobile: mostrar botão
                if (mobileToggle) {
                    mobileToggle.style.display = 'flex';
                } else {
                    // Recarregar para criar botão
                    location.reload();
                }
            }
        }, 250);
    });
});

// Prevenir scroll do body quando sidebar mobile está aberta
document.addEventListener('DOMContentLoaded', function() {
    const sidebar = document.querySelector('.sidebar, .admin-sidebar');
    
    if (sidebar) {
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.attributeName === 'class') {
                    if (sidebar.classList.contains('active') && window.innerWidth <= 968) {
                        document.body.style.overflow = 'hidden';
                    } else {
                        document.body.style.overflow = '';
                    }
                }
            });
        });
        
        observer.observe(sidebar, { attributes: true });
    }
});
