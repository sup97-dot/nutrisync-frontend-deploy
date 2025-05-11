document.addEventListener('DOMContentLoaded', async () => {
    const userId = localStorage.getItem('userId');
    try {
        const response = await fetch(`http://localhost:3000/api/auth/user/${userId}`);
        if (!response.ok) throw new Error('Failed to fetch user data');
        const user = await response.json();

        document.getElementById('firstName').value = user.first_name || '';
        document.getElementById('lastName').value = user.last_name || '';
        document.getElementById('email').value = user.email || '';
        document.getElementById('username').value = user.username || '';
        document.getElementById('password').value = '********'; 
        document.getElementById('phone').value = user.phone_number || '';
    } catch (err) {
        console.error('Error loading user data:', err);
        alert('Failed to load user data');
    }
});
