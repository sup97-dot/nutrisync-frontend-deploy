document.addEventListener('DOMContentLoaded', () => {
    const guestPlan = JSON.parse(localStorage.getItem('guestPlan'));

    if (!guestPlan || !guestPlan.meals || guestPlan.meals.length === 0) {
        alert('No guest plan data found.');
        return;
    }

    const mealColumns = document.querySelectorAll('.meal-column');
    const meals = guestPlan.meals;
    const nutrients = guestPlan.nutrients;

    meals.forEach((meal, index) => {
        if (index >= mealColumns.length) return;

        const column = mealColumns[index];
        const imgDiv = column.querySelector('.meal-img');
        const nameDiv = column.querySelector('.meal-name');
        const infoDiv = column.querySelector('.meal-info');

        imgDiv.innerHTML = `<img src="https://spoonacular.com/recipeImages/${meal.id}-480x360.jpg" alt="${meal.title}" style="width:100%; height:auto;" />`;
        nameDiv.textContent = meal.title;

        infoDiv.innerHTML = `
            <p>Calories <span>${nutrients.calories}</span></p>
            <p>Fat <span>${nutrients.fat}</span></p>
            <p>Carbs <span>${nutrients.carbohydrates}</span></p>
            <p>Protein <span>${nutrients.protein}</span></p>
        `;
    });
});
