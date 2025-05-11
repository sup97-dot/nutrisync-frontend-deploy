document.getElementById('guestMealPlanForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const form = e.target;
    const height = form.height.value;
    const weight = form.weight.value;
    const age = form.age.value;
    const gender = form.gender.value;
    const goal = form.goal.value;

    try {
        const response = await fetch('http://localhost:3000/api/mealplan/generate-daily-guest', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ height, weight, age, gender, goal })
        });

        if (!response.ok) throw new Error('Failed to calculate guest nutrition');

        const data = await response.json();
        console.log('Backend response:', data);

        console.log('Saving to localStorage:', data);
        localStorage.setItem('guestPlan', JSON.stringify(data));
        window.location.href = 'guestplan.html';


    } catch (err) {
        console.error('Guest plan error:', err);
        alert('Error calculating guest nutrition.');
    }
});

