document.querySelector('.login-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const newPassword = document.getElementById('username').value;
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    if (!token) {
        alert('Missing reset token in URL.');
        return;
    }

    try {
        const res = await fetch('http://localhost:3000/api/auth/reset-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token, newPassword })
        });

        const data = await res.json();
        if (res.ok) {
            alert('Password reset successful! You can now log in.');
            window.location.href = 'login.html';
        } else {
            alert(data.message || 'Failed to reset password.');
        }
    } catch (err) {
        console.error('Reset password error:', err);
        alert('Failed to reset password.');
    }
});
