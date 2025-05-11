document.addEventListener('DOMContentLoaded', async () => {
    const trendingTab = document.querySelector('.tab:nth-child(1)') || document.querySelector('.comm-tab:nth-child(1)');
    const communityTab = document.querySelector('.tab:nth-child(2)') || document.querySelector('.comm-tab:nth-child(2)');
    const trendingContainer = document.querySelector('.trendcard-grid');
    const communityContainer = document.querySelector('.comm-layout');
    
    if (trendingTab && communityTab) {
        if (trendingContainer) {
            trendingTab.classList.add('active');
            
            trendingTab.addEventListener('click', () => {
                window.location.href = 'trending.html';
            });
            
            communityTab.addEventListener('click', () => {
                window.location.href = 'community.html';
            });
        } else if (communityContainer) {
            communityTab.classList.add('active');
            
            trendingTab.addEventListener('click', () => {
                window.location.href = 'trending.html';
            });
            
            communityTab.addEventListener('click', () => {
                window.location.href = 'community.html';
            });
        }
    }
    
    function generateStarRating(rating) {
        let starsHtml = '';
        for (let i = 1; i <= 5; i++) {
            if (i <= rating) {
                starsHtml += '<span class="star gold">★</span>';
            } else {
                starsHtml += '<span class="star grey">★</span>';
            }
        }
        return starsHtml;
    }
    
    async function loadTrendingRecipes() {
        if (!trendingContainer) return;
        
        try {
            const response = await fetch('http://localhost:3000/api/mealplan/trending');
            if (!response.ok) {
                throw new Error('Failed to fetch trending recipes');
            }
            
            const recipes = await response.json();
            
            trendingContainer.innerHTML = '';
            
            if (!recipes || recipes.length === 0) {
                const sampleRecipes = [
                    { name: 'Chicken Parmigiana', rating: 5, image_url: 'https://thecozycook.com/wp-content/uploads/2022/08/Chicken-Parmesan-Recipe-1.jpg' },
                    { name: 'Beef Stroganoff', rating: 4, image_url: 'https://natashaskitchen.com/wp-content/uploads/2020/01/Beef-Stroganoff-3.jpg' },
                    { name: 'Vegetable Curry', rating: 4, image_url: 'https://rainbowplantlife.com/wp-content/uploads/2022/04/vegetable-curry-in-pot-1-610x915.jpg' },
                    { name: 'Salmon with Asparagus', rating: 5, image_url: 'https://healthyrecipesblogs.com/wp-content/uploads/2022/03/baked-salmon-and-asparagus-featured-2021.jpg' },
                    { name: 'Greek Salad', rating: 3, image_url: 'https://www.recipetineats.com/wp-content/uploads/2020/05/Greek-Salad_9-SQ.jpg' },
                    { name: 'Chocolate Lava Cake', rating: 5, image_url: 'https://preppykitchen.com/wp-content/uploads/2022/03/Lava-Cake-Recipe-Card.jpg' }
                ];
                
                sampleRecipes.forEach(recipe => {
                    const card = document.createElement('div');
                    card.className = 'trendcard';
                    card.innerHTML = `
                        <div class="trendcard-image" style="background-image: url('${recipe.image_url}'); background-size: cover; background-position: center;"></div>
                        <div class="trendcard-stars">
                            ${generateStarRating(recipe.rating)}
                        </div>
                        <p class="trendcard-title">${recipe.name}</p>
                    `;
                    
                    card.addEventListener('click', () => {
                        alert('This is a sample recipe. In a real implementation, this would link to the recipe details page.');
                    });
                    
                    trendingContainer.appendChild(card);
                });
            } else {
                recipes.forEach(recipe => {
                    const card = document.createElement('div');
                    card.className = 'trendcard';
                    
                    const name = recipe.rec_name || 'Recipe Name';
                    const rating = recipe.rating || Math.floor(Math.random() * 5) + 1; // Random rating if not available
                    const imageUrl = recipe.image_url || 'images/placeholder-food.jpg';
                    
                    card.innerHTML = `
                        <div class="trendcard-image" style="background-image: url('${imageUrl}'); background-size: cover; background-position: center;"></div>
                        <div class="trendcard-stars">
                            ${generateStarRating(rating)}
                        </div>
                        <p class="trendcard-title">${name}</p>
                    `;
                    
                    card.addEventListener('click', () => {
                        window.location.href = `recipe.html?planId=${recipe.plan_id}`;
                    });
                    
                    trendingContainer.appendChild(card);
                });
            }
        } catch (error) {
            console.error('Error loading trending recipes:', error);
            trendingContainer.innerHTML = '<p class="error-message">Failed to load trending recipes. Please try again later.</p>';
        }
    }
    
    function setupCommunityPage() {
        if (!communityContainer) return;
        
        const feedSection = document.querySelector('.feed');
        if (feedSection) {
            feedSection.innerHTML = `
                <h2 class="feed-title">Community Highlights</h2>
                
                <div class="post">
                    <div class="post-top">
                        <div class="post-icon">📣</div>
                        <div class="post-content">
                            <p><strong>NutriSync Team</strong></p>
                            <p>Welcome to our community! Here you can find trending recipes and nutritional tips from other users.</p>
                        </div>
                    </div>
                </div>
                
                <div class="post">
                    <div class="post-top">
                        <div class="post-icon">🍽️</div>
                        <div class="post-content">
                            <p><strong>Weekly Challenge</strong></p>
                            <p>This week's meal prep challenge: Create a balanced meal using seasonal vegetables!</p>
                        </div>
                    </div>
                </div>
                
                <div class="post">
                    <div class="post-top">
                        <div class="post-icon">🥗</div>
                        <div class="post-content">
                            <p><strong>Nutrition Tip</strong></p>
                            <p>Did you know? Meal planning can reduce food waste by up to 30% and save you money on groceries!</p>
                        </div>
                    </div>
                </div>
            `;
        }
        
        const updatesBox = document.querySelector('.updates-box');
        if (updatesBox) {
            updatesBox.innerHTML = `
                <h3>NUTRITIONAL TIPS</h3>
                <ul class="updates-list">
                    <li>Protein helps build and repair muscles</li>
                    <li>Aim for 5 servings of vegetables daily</li>
                    <li>Stay hydrated with 8 glasses of water</li>
                    <li>Include healthy fats like avocados and nuts</li>
                </ul>
            `;
        }
        
        const forumBox = document.querySelector('.forum-box');
        if (forumBox) {
            forumBox.innerHTML = `
                <h3>POPULAR CATEGORIES</h3>
                <div class="enter-divider"></div>
                <ul class="updates-list" style="text-align: left; padding-left: 10px;">
                    <li>Quick & Easy Meals</li>
                    <li>Vegetarian Options</li>
                    <li>High Protein</li>
                    <li>Gluten-Free</li>
                </ul>
            `;
        }
    }
    
    
    loadTrendingRecipes();
    setupCommunityPage();
});