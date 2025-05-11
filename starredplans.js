document.addEventListener('DOMContentLoaded', async () => {
    const starredPlansContainer = document.getElementById('starred-plans-container');
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');

    if (!userId || !token) {
        starredPlansContainer.innerHTML = `
            <p class="error-message">Please log in to view your starred meal plans</p>
        `;
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/api/starred/user/${userId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error(`Server responded with status: ${response.status}`);
        }

        const meals = await response.json();

        if (!Array.isArray(meals) || meals.length === 0) {
            starredPlansContainer.innerHTML = `
                <p class="empty-message">
                    You haven't starred any meals yet. Browse your meal plans and click the star icon to save your favorites!
                    <br><br>
                    <a href="userplan.html" class="button-link">View My Meal Plans</a>
                </p>
            `;
            return;
        }

        const groupedMeals = {
            breakfast: [],
            lunch: [],
            dinner: []
        };

        meals.forEach(meal => {
            if (groupedMeals[meal.meal_type]) {
                groupedMeals[meal.meal_type].push(meal);
            }
        });

        starredPlansContainer.innerHTML = '';

        ['breakfast', 'lunch', 'dinner'].forEach(type => {
            if (groupedMeals[type].length === 0) {
                return; 
            }

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
                        <div>Calories: ${meal.calories || 0}</div>
                        <div>Protein: ${meal.protein || 0}g</div>
                        <div>Carbs: ${meal.carbs || 0}g</div>
                        <div>Fats: ${meal.fats || 0}g</div>
                    </div>
                    <div class="card-buttons">
                        <button class="recipe-button" data-plan-id="${meal.plan_id}">View Recipe</button>
                        <button class="unstar-button" data-plan-id="${meal.plan_id}">Unstar</button>
                    </div>
                `;
                grid.appendChild(card);
            });

            section.appendChild(grid);
            starredPlansContainer.appendChild(section);
        });

        starredPlansContainer.addEventListener('click', async (e) => {
            if (e.target.classList.contains('recipe-button')) {
                const planId = e.target.getAttribute('data-plan-id');
                window.location.href = `recipe.html?planId=${planId}`;
            }
            
            if (e.target.classList.contains('unstar-button')) {
                const planId = e.target.getAttribute('data-plan-id');
                const button = e.target;
                
                try {
                    const res = await fetch(`http://localhost:3000/api/starred/unstar/${planId}`, {
                        method: 'DELETE',
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    
                    if (res.ok) {
                        const card = button.closest('.meal-card');
                        card.remove();
                        
                        const section = button.closest('.meal-section');
                        const remainingCards = section.querySelectorAll('.meal-card');
                        
                        if (remainingCards.length === 0) {
                            section.remove();
                        }
                        
                        const remainingSections = document.querySelectorAll('.meal-section');
                        if (remainingSections.length === 0) {
                            starredPlansContainer.innerHTML = `
                                <p class="empty-message">
                                    You haven't starred any meals yet. Browse your meal plans and click the star icon to save your favorites!
                                    <br><br>
                                    <a href="userplan.html" class="button-link">View My Meal Plans</a>
                                </p>
                            `;
                        }
                    } else {
                        alert('Failed to unstar meal. Please try again.');
                    }
                } catch (err) {
                    console.error('Error unstarring meal:', err);
                    alert('An error occurred. Please try again later.');
                }
            }
        });

    } catch (err) {
        console.error('Error loading starred plans:', err);
        starredPlansContainer.innerHTML = `
            <p class="error-message">Error loading starred meal plans. Please try again later.</p>
        `;
    }
});