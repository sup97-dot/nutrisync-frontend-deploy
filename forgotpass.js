document.querySelector('.login-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('username').value;

    try {
        const res = await fetch('http://localhost:3000/api/auth/forgot-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });

        const data = await res.json();
        alert(data.message);
    } catch (err) {
        console.error('Forgot password error:', err);
        alert('Failed to send password reset email.');
    }
});
