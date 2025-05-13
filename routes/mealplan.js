const express = require('express');
const axios = require('axios');
const db = require('../db');
const router = express.Router();

router.get('/generate-weekly-plan', async (req,res) => {

    const userId = parseInt(req.query.user_id);
    const startDate = req.query.start_date ? new Date(req.query.start_date) : new Date();

    if (!userId) return res.status(400).send('Missing user_id');

    try {
        const response = await axios.get('https://api.spoonacular.com/mealplanner/generate', {
            params: { 
                timeFrame: 'week',
                apiKey: process.env.SPOONACULAR_API_KEY
            }
        });
        const mealPlan = response.data.week;


        const parseValue = (val) => {
            if (!val || typeof val !== 'string') return 0;
            return parseFloat(val.replace(/[^\d.]/g, '')) ||0;
        }

        const mealTypes = ['breakfast', 'lunch', 'dinner'];

        for (let dayOffset = 0; dayOffset< 7; dayOffset++) {
            const dayKey = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'][dayOffset];
            const date = new Date(startDate);
            date.setDate(date.getDate() + dayOffset);

            const meals = mealPlan[dayKey]?.meals || [];

            for (let i = 0; i < meals.length; i++ ) {
                const meal = meals[i];
                const mealType = mealTypes[i] ? mealTypes[i] : `meal_${i + 1}`;
                
                const {
                    id: api_recipe_id,
                    title,
                    imageType,
                    readyInMinutes,
                    type
                } = meal;

                const image = `https://spoonacular.com/recipeImages/${api_recipe_id}-480x360.${imageType}`;

                const [existingRecipe] = await db.promise().query('SELECT recipe_id FROM recipes WHERE api_recipe_id = ?', [api_recipe_id]);
                let recipe_id;

                if (existingRecipe.length === 0) {
                    const insertRecipeSql = `INSERT INTO recipes (api_recipe_id, rec_name, instructions, image_url, prep_time, cook_time) VALUES (?, ?, ?, ?, ?, ?)`;
                    await db.promise().query(insertRecipeSql, [api_recipe_id, title, '', image, readyInMinutes, 0]);

                    const nutritionRes = await axios.get (`https://api.spoonacular.com/recipes/${api_recipe_id}/nutritionWidget.json`, {
                        params: { apiKey: process.env.SPOONACULAR_API_KEY }
                    });
                    const { calories, protein, carbohydrates: carbs, fat: fats } = nutritionRes.data;
                    const nutritionSql = `INSERT INTO nutrition (api_recipe_id, calories, protein, carbs, fats) VALUES (?, ?, ?, ?, ?)`;
                    await db.promise().query(nutritionSql,[
                        api_recipe_id,
                        parseValue(calories),
                        parseValue(protein),
                        parseValue(carbs),
                        parseValue(fats)
                    ]);

                    const [newRecipe] = await db.promise().query('SELECT recipe_id FROM recipes WHERE api_recipe_id = ?', [api_recipe_id]);
                    recipe_id = newRecipe[0].recipe_id;
                } else {
                    recipe_id = existingRecipe[0].recipe_id;
                }

                const mealSql = `INSERT INTO meal_plans (user_id, recipe_id, meal_date, meal_type, calories, protein, carbs, fats) SELECT ?, ?, ?, ?, n.calories, n.protein, n.carbs, n.fats FROM nutrition n WHERE n.api_recipe_id = ?`;

                await db.promise().query(mealSql, [
                    userId,
                    recipe_id,
                    date.toISOString().split('T')[0],
                    mealType,
                    api_recipe_id
                ]);
            }
        }

        
        res.send('Weekly meal plan generated and saved');
    } catch (err) {
        console.error('Meal plan generation error:', err);
        res.status(500).send('Failed to generate meal plan.');

    }
});

router.get('./get user/user_id', async (req,res) => {

    const {userId} = req.params;

    try {
        const [rows] = await db.promise().query(
            `SELECT meal_plans.plan_id, meal_plans.meal_date, meal_plans.meal_type, meal_plans.calories, meal_plans.protein, meal_plans.carbs, meal_plans.fats, r.rec_name, r.image_url 
            FROM meal_plan 
            JOIN recipes ON meal_plans.recipe_id = recipes.recipe_id 
            WHERE meal_plans.user_id = ? 
            ORDER BY meal_plans.meal_date ASC, FIELD(meal_plans.meal_type, 'breakfast', 'lunch', 'dinner')`,
            [userId]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: 'No meal plan found for this user.' });
        }

        res.json(rows);
    } catch (err) {
        console.error('Error fetching meal plan:', err);
        res.status(500).json({ message: 'Failed to fetch meal plan.' });
    }
});

module.exports = router;
