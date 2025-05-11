document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.login-form');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const first_name = document.getElementById('firstname').value.trim();
        const last_name = document.getElementById('lastname').value.trim();
        const username = document.getElementById('username').value.trim();
        const email = username;
        const password = document.getElementById('password').value.trim();

        const phone_number = null;
        const weight = null;
        const height = null;
        const goal = 'maintain';
        const diet_prefer = 'none';
        const gender = 'unspecified';
        const age = 0;

        try {
            const res = await fetch('http://localhost:3000/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    first_name,
                    last_name,
                    username,
                    email,
                    password,
                    phone_number,
                    weight,
                    height,
                    goal,
                    diet_prefer,
                    gender,
                    age
                })
            });

            const data = await res.text();

            if (res.ok) {
                alert('Account created successfully! You can now log in.');
                window.location.href = '/login.html';
            } else {
                alert(data || 'Signup failed.');
            }
        } catch (err) {
            console.error('Signup error:', err);
            alert('An error occurred. Please try again.');
        }
    });
});
