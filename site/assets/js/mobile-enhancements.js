// Melhorias gerais para mobile
document.addEventListener('DOMContentLoaded', function() {
    
    // 1. Smooth scroll para toda a página
    document.documentElement.style.scrollBehavior = 'smooth';
    
    // 2. Melhorar performance de scroll em mobile
    let ticking = false;
    let lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', function() {
        lastScrollY = window.scrollY;
        
        if (!ticking) {
            window.requestAnimationFrame(function() {
                // Header sticky behavior
                const header = document.querySelector('.header');
                if (header) {
                    if (lastScrollY > 50) {
                        header.style.background = 'rgba(5, 32, 22, 0.98)';
                        header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.3)';
                    } else {
                        header.style.background = 'rgba(5, 32, 22, 0.95)';
                        header.style.boxShadow = 'none';
                    }
                }
                
                ticking = false;
            });
            
            ticking = true;
        }
    });
    
    // 3. Lazy loading de imagens
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver(function(entries, observer) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    observer.unobserve(img);
                }
            });
        });
        
        document.querySelectorAll('img[data-src]').forEach(function(img) {
            imageObserver.observe(img);
        });
    }
    
    // 4. Touch feedback visual para botões
    document.querySelectorAll('.btn, button, .nav-item, .card').forEach(function(element) {
        element.addEventListener('touchstart', function() {
            this.style.opacity = '0.7';
        });
        
        element.addEventListener('touchend', function() {
            this.style.opacity = '1';
        });
        
        element.addEventListener('touchcancel', function() {
            this.style.opacity = '1';
        });
    });
    
    // 5. Detectar orientação do dispositivo
    function handleOrientationChange() {
        const isLandscape = window.innerWidth > window.innerHeight;
        document.body.classList.toggle('landscape', isLandscape);
        document.body.classList.toggle('portrait', !isLandscape);
    }
    
    handleOrientationChange();
    window.addEventListener('resize', handleOrientationChange);
    window.addEventListener('orientationchange', handleOrientationChange);
    
    // 6. Prevenir zoom duplo-toque em iOS
    let lastTouchEnd = 0;
    document.addEventListener('touchend', function(event) {
        const now = Date.now();
        if (now - lastTouchEnd <= 300) {
            event.preventDefault();
        }
        lastTouchEnd = now;
    }, false);
    
    // 7. Melhorar inputs em mobile
    const inputs = document.querySelectorAll('input, textarea, select');
    inputs.forEach(function(input) {
        // Scroll para o input quando focado (evita que fique atrás do teclado)
        input.addEventListener('focus', function() {
            setTimeout(function() {
                input.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 300);
        });
    });
    
    // 8. Detectar se está offline
    function updateOnlineStatus() {
        const status = navigator.onLine ? 'online' : 'offline';
        document.body.classList.toggle('offline', !navigator.onLine);
        
        if (!navigator.onLine) {
            showNotification('Você está offline', 'error');
        }
    }
    
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    
    // 9. Pull to refresh (experimental)
    let startY = 0;
    let isPulling = false;
    
    document.addEventListener('touchstart', function(e) {
        if (window.scrollY === 0) {
            startY = e.touches[0].pageY;
            isPulling = true;
        }
    });
    
    document.addEventListener('touchmove', function(e) {
        if (!isPulling) return;
        
        const currentY = e.touches[0].pageY;
        const diff = currentY - startY;
        
        if (diff > 100 && window.scrollY === 0) {
            // Mostrar indicador de pull to refresh
            const indicator = document.querySelector('.pull-refresh-indicator');
            if (indicator) {
                indicator.classList.add('active');
            }
        }
    });
    
    document.addEventListener('touchend', function() {
        if (!isPulling) return;
        isPulling = false;
        
        const indicator = document.querySelector('.pull-refresh-indicator');
        if (indicator && indicator.classList.contains('active')) {
            indicator.classList.remove('active');
            // location.reload(); // Descomentar para ativar refresh
        }
    });
    
    // 10. Otimizar animações em mobile
    if (window.matchMedia('(max-width: 768px)').matches) {
        // Reduzir animações complexas em mobile
        document.querySelectorAll('.animate-complex').forEach(function(el) {
            el.classList.remove('animate-complex');
        });
    }
    
    // 11. Viewport height fix para mobile (100vh problem)
    function setVH() {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', vh + 'px');
    }
    
    setVH();
    window.addEventListener('resize', setVH);
    
    // 12. Adicionar classe de plataforma
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isAndroid = /Android/.test(navigator.userAgent);
    
    document.body.classList.toggle('mobile', isMobile);
    document.body.classList.toggle('ios', isIOS);
    document.body.classList.toggle('android', isAndroid);
});

// Função helper para notificações
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 12px 20px;
        background: ${type === 'error' ? '#ef4444' : '#22c55e'};
        color: white;
        border-radius: 8px;
        z-index: 10000;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        animation: slideInRight 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(function() {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(function() {
            notification.remove();
        }, 300);
    }, 3000);
}

// Debounce helper
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}
