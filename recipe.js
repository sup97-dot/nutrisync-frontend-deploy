document.addEventListener('DOMContentLoaded', async () => {
    const params = new URLSearchParams(window.location.search);
    const planId = params.get('planId');
    const title = document.querySelector('.recipe-title');
    const recipeBox = document.querySelector('.recipe-box');
    const nutritionBox = document.querySelector('.nutrition-box');
    const infoBoxes = document.querySelectorAll('.info-box');
    const recipeInfoBox = document.querySelector('.info-section .info-box:nth-child(1)');
    const ingredientsInfoBox = document.querySelector('.info-section .info-box:nth-child(2)');
    const starButton = document.querySelector('.circle-button[title="Star"]');

    let isStarred = false;
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');


    if (!planId) {
        title.textContent = 'Recipe Not Found';
        return;
    }

    if (!userId || !token) {
        if (starButton) starButton.style.display = 'none';
    } else {
        try {
            const starRes = await fetch(`http://localhost:3000/api/starred/check/${planId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (starRes.ok) {
                const starData = await starRes.json();
                isStarred = starData.isStarred;

                if (isStarred) {
                    starButton.classList.add('starred');
                    starButton.style.backgroundColor = '#FFD700';
                } else {
                    starButton.classList.remove('starred')
                    starButton.style.backgroundColor = '';
                }
            }
        } catch (err) {
            console.error('Error checking star status:', err);
        }

        if (starButton) {
            starButton.addEventListener('click', async () => {
                try {
                    const url = isStarred
                        ?`http://localhost:3000/api/starred/unstar/${planId}`
                        :`http://localhost:3000/api/starred/star/${planId}`;

                    const method = isStarred ? 'DELETE' : 'POST';

                    const res = await fetch(url, {
                        method: method,
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    });
                    
                    if (res.ok) {
                        isStarred = !isStarred;

                        if (isStarred) {
                            starButton.classList.add('starred');
                            starButton.style.backgroundColor = '#FFD700';
                            alert('Recipe added to your starred meals');
                        } else {
                            starButton.classList.remove('starred');
                            starButton.style.backgroundColor = '';
                            alert('Recipe removed from your starred meals');
                        }
                    } else {
                        const data = await res.json();
                        alert(`Error: ${data.message}`);
                    }
                } catch (err) {
                    console.error('Error toggling star:', err);
                    alert('Failed to update star status');
                }
            });
        }
    }

    try {
        const res = await fetch(`http://localhost:3000/api/mealplan/recipe/${planId}`);
        const recipe = await res.json();

        if (!res.ok) throw new Error(recipe.message);

        title.textContent = recipe.rec_name;
        recipeBox.innerHTML = `
            <img src="${recipe.image_url}" alt="${recipe.rec_name}" style="width:100%; height:auto;" />
        `;

        nutritionBox.innerHTML = `
            <h3>Nutrition Info</h3>
            <p>Calories: ${recipe.calories}</p>
            <p>Fat: ${recipe.fats} g</p>
            <p>Carbs: ${recipe.carbs} g</p>
            <p>Protein: ${recipe.protein} g</p>
        `;

        recipeInfoBox.innerHTML = `
            <h3>Recipe</h3>
            <p>${recipe.instructions || "No instructions provided."}</p>
            `;

        if (recipe.ingredients && recipe.ingredients.length > 0) {
            ingredientsInfoBox.innerHTML = `
                <h3>INGREDIENTS</h3>
                <ul>${recipe.ingredients.map(ing => `<li>${ing}</li>`).join('')}</ul>
                `;
        } else {
            ingredientsInfoBox.innerHTML = `
                <h3>INGREDIENTS</h3>
                <p>No ingredients provided.</p>
                `;
        }

        
    } catch (err) {
        console.error('Error loading recipe:', err);
        title.textContent = 'Error loading recipe';
    }
});
