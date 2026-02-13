// Notifications System
function toggleNotifications() {
    const drawer = document.getElementById('notificationsDrawer');
    const overlay = document.getElementById('notificationsOverlay');
    
    // Fechar profile se estiver aberto
    const profileDrawer = document.getElementById('profileDrawer');
    const profileOverlay = document.getElementById('profileOverlay');
    if (profileDrawer && profileDrawer.classList.contains('open')) {
        profileDrawer.classList.remove('open');
        profileOverlay.classList.remove('open');
    }
    
    drawer.classList.toggle('open');
    overlay.classList.toggle('open');
}

function toggleProfile() {
    const drawer = document.getElementById('profileDrawer');
    const overlay = document.getElementById('profileOverlay');
    
    // Fechar notifications se estiver aberto
    const notificationsDrawer = document.getElementById('notificationsDrawer');
    const notificationsOverlay = document.getElementById('notificationsOverlay');
    if (notificationsDrawer && notificationsDrawer.classList.contains('open')) {
        notificationsDrawer.classList.remove('open');
        notificationsOverlay.classList.remove('open');
    }
    
    drawer.classList.toggle('open');
    overlay.classList.toggle('open');
}

function markAllAsRead() {
    const unreadItems = document.querySelectorAll('.notification-item.unread');
    const badge = document.querySelector('.notification-badge');
    
    unreadItems.forEach(item => {
        item.classList.remove('unread');
        item.classList.add('read');
        const dot = item.querySelector('.unread-dot');
        if (dot) dot.remove();
    });
    
    if (badge) {
        badge.textContent = '0';
    }
}

// Fechar drawer ao pressionar ESC
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const drawer = document.getElementById('notificationsDrawer');
        const overlay = document.getElementById('notificationsOverlay');
        const profileDrawer = document.getElementById('profileDrawer');
        const profileOverlay = document.getElementById('profileOverlay');
        
        if (drawer && drawer.classList.contains('open')) {
            drawer.classList.remove('open');
            overlay.classList.remove('open');
        }
        
        if (profileDrawer && profileDrawer.classList.contains('open')) {
            profileDrawer.classList.remove('open');
            profileOverlay.classList.remove('open');
        }
    }
});
