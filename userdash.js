document.addEventListener('DOMContentLoaded', () => {
    
    const generateForm = document.getElementById('generateMealPlanForm');
        
    const username = localStorage.getItem('username');
    if (username) {
        document.querySelector('h2').textContent = `Welcome back, ${username}!`
    }

    generateForm.addEventListener('submit', async(e) => {
        e.preventDefault()

        const userId = localStorage.getItem('userId');
        if(!userId) {
            alert('Please log in again');
            window.location.href = 'login.html';
            return;
        }

        const submitButton = generateForm.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.textContent;
        submitButton.disabled = true;
        submitButton.textContent = 'Generating plan...';

        const height = parseFloat(generateForm.querySelector('input[name="height"]').value);
        const weight = parseFloat(generateForm.querySelector('input[name="weight"]').value);
        const age = parseInt(generateForm.querySelector('input[name="age"]').value);
        const gender = generateForm.querySelector('input[name="gender"]').value.toLowerCase();
        const goal = generateForm.querySelector('input[name="goal"]').value.toLowerCase();

        if (!['gain', 'lose', 'maintain'].includes(goal)) {
            alert('Goal must be "gain", "lose", or "maintain"');
            submitButton.disabled = false;
            submitButton.textContent = originalButtonText;
            return;
        }
        
        if (!['male', 'female', 'other', 'unspecified'].includes(gender)) {
            alert('Gender must be "male", "female", "other", or "unspecified"');
            submitButton.disabled = false;
            submitButton.textContent = originalButtonText;
            return;
        }

        try {
            const updateProfileResponse = await fetch(`http://localhost:3000/api/auth/user/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
            body: JSON.stringify({
                height,
                weight,
                age,
                gender,
                goal
            })
        });

        if (!updateProfileResponse.ok) {
            console.warn('Could not update user profile, but continuing with meal plan generation');
        }

        const response = await fetch(`http://localhost:3000/api/mealplan/generate-weekly-plan?user_id=${userId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

            if (!response.ok) {
                throw new Error(`Server responded with status: ${response.status}`);
            }

            const responseText = await response.text();
            console.log('Meal plan generation response:', responseText);
            
            window.location.href = 'userplan.html'

                

            

        } catch (err) {
            console.error('Error generating meal plan:', err);
            alert('Error generating meal plan. Please try again.');
            submitButton.disabled = false;
            submitButton.textContent = originalButtonText;
        }
    });
});