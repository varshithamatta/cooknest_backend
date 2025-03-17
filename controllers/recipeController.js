const Recipe = require("../models/Recipe");
const Chef = require("../models/Chef");
const { Op } = require("sequelize");

// ✅ Search & Filter Recipes
exports.searchRecipes = async (req, res) => {
    try {
        const { q, category, cuisine, type, sort, order } = req.query;

        // ✅ Build Search Conditions
        let whereConditions = {};

        // 🔍 Search by Recipe Name (q)
        if (q) {
            whereConditions.recipe_name = { [Op.iLike]: `%${q}%` }; // Case-insensitive search
        }

        // 🍽 Filter by Category
        if (category) {
            whereConditions.category = category;
        }

        // 🌍 Filter by Cuisine Type
        if (cuisine) {
            whereConditions.cuisine_type = cuisine;
        }

        // 🥗 Filter by Veg/Non-Veg
        if (type) {
            whereConditions.type = type;
        }

        // ✅ Define Sorting
        let orderCondition = [["createdAt", "DESC"]]; // Default: Newest First
        if (sort && order) {
            orderCondition = [[sort, order.toUpperCase()]]; // Example: [["rating", "DESC"]]
        }

        // 🔎 Fetch Recipes with Chef Details
        const recipes = await Recipe.findAll({
            where: whereConditions,
            include: {
                model: Chef,
                attributes: ["name", "profile_image"]
            },
            order: orderCondition
        });

        res.status(200).json(recipes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateRecipe = async (req, res) => {
    try {
        const { image } = req.body;
        const recipe = await Recipe.findByPk(req.params.id);

        if (!recipe) return res.status(404).json({ error: "Recipe not found" });

        // ✅ Update Recipe Image if Provided
        if (image) recipe.image = image;

        await recipe.save();
        res.status(200).json({ message: "Recipe updated", recipe });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

