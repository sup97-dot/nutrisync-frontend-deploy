document.addEventListener('DOMContentLoaded', async () => {
    
    const Container = document.querySelector('.meal-plan-container');

    Container.innerHTML = '<p styple="text-align: center; padding: 2rem;">Loading your meal plan...</p>'

    const userId = localStorage.getItem('userId');
    if (!userId) {
        Container.innerHTML = '<p style"text-align: center; padding: 2rem;">Please log in to view your meal plan</p>';
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/api/mealplan/user/${userId}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (!response.ok) {
            throw new Error(`Server responded with status: ${response.status}`);
        }
        const meals = await response.json();

        if (!Array.isArray(meals) || meals.length === 0) {
            Container.innerHTML = `
            <p style="text-align: center; padding: 2rem";>
                No meal plan found. Please generate a meal plan from your dashboard.
                <br><br>
                <a href="userdash.html" style="display: inline-block; padding: 0.5rem 1rem; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 4px;">
                Return to Dashboard
                </a>
            </p>`;
            return;
        };

        const groupedMeals = {
            breakfast: [],
            lunch: [],
            dinner: []
        };

        meals.forEach(meal => {
            groupedMeals[meal.meal_type].push(meal);
        });

        Container.innerHTML = '';

        ['breakfast', 'lunch','dinner'].forEach(type => {
            const section = document.createElement('section');
            section.className = 'meal-section';
            section.innerHTML = `<h2 class="meal-title">${type.charAt(0).toUpperCase() + type.slice(1)}</h2>`;

            const grid = document.createElement('div');
            grid.className = 'meal-grid';

            groupedMeals[type].forEach(meal => {
                const card = document.createElement('div');
                card.className = 'meal-card';
                card.innerHTML = `
                <div class="day-label">${new Date(meal.meal_date).toLocaleDateString()}</div>
                <img class="meal-image" src="${meal.image_url}" alt="${meal.rec_name}" />
                <div class="meal-name">${meal.rec_name}</div>
                <div class="nutrition">
                    <div>Calories: ${meal.calories}</div>
                    <div>Protein: ${meal.protein}g</div>
                    <div>Carbs: ${meal.carbs}g</div>
                    <div>Fats: ${meal.fats}g</div>
                </div>
                <button class ="recipe-button" data-recipe-id="${meal.plan_id}">View Recipe</button>
                `;
                grid.appendChild(card);
            });
            
            section.appendChild(grid);
            Container.appendChild(section);
        });

            Container.addEventListener('click', (e) => {
                if (e.target.classList.contains('recipe-button')) {
                    const planId = e.target.getAttribute('data-recipe-id');
                    window.location.href = `recipe.html?planId=${planId}`;
                }
            });
        } catch (err) {
            console.error('Error loading meal plan:', err);
            Container.innerHTML = '<p>Error loading meal plan. Please try again later.</p>';
        }
});
