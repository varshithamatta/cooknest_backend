const LikedRecipe = require("../models/LikedRecipe");

// Like a Recipe
exports.likeRecipe = async (req, res) => {
    try {
        const { userId, recipeId } = req.body;

        // Check if already liked
        const existingLike = await LikedRecipe.findOne({ where: { user_id: userId, recipe_id: recipeId } });
        if (existingLike) {
            return res.status(400).json({ message: "Recipe already liked!" });
        }

        // Like the Recipe
        await LikedRecipe.create({ user_id: userId, recipe_id: recipeId });
        res.status(201).json({ message: "Recipe liked successfully!" });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Unlike a Recipe
exports.unlikeRecipe = async (req, res) => {
    try {
        const { userId, recipeId } = req.body;

        // Remove like
        await LikedRecipe.destroy({ where: { user_id: userId, recipe_id: recipeId } });
        res.status(200).json({ message: "Recipe unliked successfully!" });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get Liked Recipes for a User
exports.getLikedRecipes = async (req, res) => {
    try {
        const { userId } = req.params;

        // Fetch liked recipes
        const likedRecipes = await LikedRecipe.findAll({ where: { user_id: userId } });
        res.status(200).json(likedRecipes);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
