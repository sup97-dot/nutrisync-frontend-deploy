document.addEventListener('DOMContentLoaded', () => {
    const guestPlan = JSON.parse(localStorage.getItem('guestPlan'));

    if (!guestPlan || !guestPlan.meals || guestPlan.meals.length === 0) {
        console.error('No guest meal plan found in localStorage');
        return;
    }

    const mealColumns = document.querySelectorAll('.meal-column');

    guestPlan.meals.forEach((meal, index) => {
        if (index < mealColumns.length) {
            const column = mealColumns[index];
            column.querySelector('.meal-name').textContent = meal.title;
            column.querySelector('.meal-img').innerHTML = `<img src="https://spoonacular.com/recipeImages/${meal.id}-480x360.jpg" alt="${meal.title}" style="width:100%; height:auto;" />`;
            column.querySelector('.meal-info').innerHTML = `
                <p>Calories: ${guestPlan.nutrients.calories} kcal</p>
                <p>Fat: ${guestPlan.nutrients.fat}</p>
                <p>Carbs: ${guestPlan.nutrients.carbohydrates}</p>
                <p>Protein: ${guestPlan.nutrients.protein}</p>
            `;
        }
    });
});

