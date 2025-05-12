document.addEventListener('DOMContentLoaded', function() {
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');
    const logoutButton = document.getElementById('logoutButton');
    const loginButton = document.getElementById('loginButton');
    
    const publicPages = [
        'index.html',
        'login.html',
        'login.html',
        'guestplan.html',
        'guestdash.html',
        'contact.html'
    ];
    
    const currentPage = window.location.pathname.split('/').pop();
    const isPublicPage = publicPages.includes(currentPage);
    
    if (userId && token) {
        if (logoutButton) logoutButton.style.display = 'inline-block';
        if (loginButton) loginButton.style.display = 'none';
    } else {
        if (logoutButton) logoutButton.style.display = 'none';
        if (loginButton) loginButton.style.display = 'inline-block';
        
        if (!isPublicPage) {
            alert('Please log in to access this page');
            window.location.href = 'login.html';
        }
    }
    
    function isTokenExpired(token) {
        if (!token) return true;
        
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return Date.now() >= payload.exp * 1000;
        } catch (e) {
            console.error('Error decoding token:', e);
            return true;
        }
    }
    
    if (!isPublicPage && isTokenExpired(token)) {
        localStorage.removeItem('userId');
        localStorage.removeItem('token');
        alert('Your session has expired. Please log in again.');
        window.location.href = 'login.html';
    }
    
    if (logoutButton) {
        logoutButton.addEventListener('click', function() {
            localStorage.removeItem('userId');
            localStorage.removeItem('token');
            
            window.location.href = 'login.html';
            
            alert('You have been successfully logged out');
        });
    }
});
