document.addEventListener('DOMContentLoaded', () => {
   
   
    const loginform = document.querySelector('.login-form');
    const errorMsg = document.getElementById('loginError');

    loginform.addEventListener('submit', async (e) => {
        e.preventDefault();

        const emailOrUsername = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        try {
            const response = await fetch('http://localhost:3000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ emailOrUsername, password })
            });

            const data = await response.json();

            if (!response.ok) {
                errorMsg.style.display = 'block';
            } else {
                errorMsg.style.display = 'none';
                localStorage.setItem('token', data.token);
                localStorage.setItem('userId', data.userId);
                localStorage.setItem('startDate', data.created_at);

                window.location.href = 'userdash.html';
            }
        } catch (err) {
            console.error('Login failed:', err);
            errorMsg.style.display = 'block;'
        }
    });
});