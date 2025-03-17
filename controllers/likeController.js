const LikedRecipe = require("../models/LikedRecipe");
const Recipe = require("../models/Recipe");
const Chef = require("../models/Chef");

// ✅ Get Full Liked Recipes (Protected)
exports.getLikedRecipes = async (req, res) => {
    try {
        const userId = req.user.id; // Get logged-in user ID from JWT

        // Fetch liked recipes and include full recipe details with chef info
        const likedRecipes = await LikedRecipe.findAll({
            where: { user_id: userId },
            include: {
                model: Recipe,
                include: {
                    model: Chef,
                    attributes: ["name", "profile_image"] // Include chef name & image
                }
            }
        });

        res.status(200).json(likedRecipes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ✅ Like a Recipe (Protected)
exports.likeRecipe = async (req, res) => {
    try {
        const userId = req.user.id;
        const { recipe_id } = req.body;

        // Check if recipe exists
        const recipe = await Recipe.findByPk(recipe_id);
        if (!recipe) {
            return res.status(404).json({ error: "Recipe not found" });
        }

        // Check if user already liked this recipe
        const alreadyLiked = await LikedRecipe.findOne({
            where: { user_id: userId, recipe_id }
        });

        if (alreadyLiked) {
            return res.status(400).json({ error: "Recipe already liked" });
        }

        // Save liked recipe
        await LikedRecipe.create({ user_id: userId, recipe_id });
        res.status(201).json({ message: "Recipe liked successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ✅ Unlike a Recipe (Protected)
exports.unlikeRecipe = async (req, res) => {
    try {
        const userId = req.user.id;
        const { recipe_id } = req.params;

        const likedRecipe = await LikedRecipe.findOne({
            where: { user_id: userId, recipe_id }
        });

        if (!likedRecipe) {
            return res.status(404).json({ error: "Recipe not found in liked list" });
        }

        await likedRecipe.destroy();
        res.status(200).json({ message: "Recipe unliked successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};