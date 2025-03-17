const Recipe = require("../models/Recipe");
const LikedRecipe = require("../models/LikedRecipe");

// ✅ Get Chef Analytics (Total Recipes & Likes)
exports.getChefStats = async (req, res) => {
    try {
        const { id } = req.params;

        // Count total recipes created by the chef
        const totalRecipes = await Recipe.count({ where: { chef_id: id } });

        // Count total likes received across all recipes of this chef
        const totalLikes = await LikedRecipe.count({
            include: {
                model: Recipe,
                where: { chef_id: id }
            }
        });

        res.status(200).json({ totalRecipes, totalLikes });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateChefProfile = async (req, res) => {
    try {
        const { profile_image, cover_image } = req.body;
        const chef = await Chef.findByPk(req.params.id);

        if (!chef) return res.status(404).json({ error: "Chef not found" });

        // ✅ Update Images if Provided
        if (profile_image) chef.profile_image = profile_image;
        if (cover_image) chef.cover_image = cover_image;

        await chef.save();
        res.status(200).json({ message: "Profile updated", chef });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

