const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const Recipe = require("../models/Recipe");
const Chef = require("../models/Chef");
const { searchRecipes } = require("../controllers/recipeController");
const validate = require("../middleware/validate");
const { recipeSchema } = require("../validators/schemas");

/**
 * @swagger
 * /api/recipes:
 *   post:
 *     summary: Create a new recipe (Only for authenticated chefs)
 *     description: Allows a chef to add a new recipe to the database.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               recipe_name:
 *                 type: string
 *                 example: "Pasta Carbonara"
 *               image:
 *                 type: string
 *                 example: "https://example.com/image.jpg"
 *               category:
 *                 type: string
 *                 example: "Dinner"
 *               cuisine_type:
 *                 type: string
 *                 example: "Italian"
 *               rating:
 *                 type: number
 *                 example: 4.5
 *               time:
 *                 type: string
 *                 example: "30 min"
 *               type:
 *                 type: string
 *                 example: "Non-Veg"
 *               description:
 *                 type: string
 *                 example: "A delicious creamy pasta recipe..."
 *               ingredients:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Pasta", "Eggs", "Parmesan", "Bacon"]
 *               instructions:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Boil pasta", "Cook bacon", "Mix eggs and cheese"]
 *     responses:
 *       201:
 *         description: Recipe created successfully.
 */
router.post("/", authMiddleware, validate(recipeSchema), async (req, res) => {
    try {
        const chefId = req.user.chefId; // 🔄 Fix authMiddleware handling
        const chef = await Chef.findByPk(chefId);
        if (!chef) return res.status(404).json({ error: "Chef not found" });

        const recipe = await Recipe.create({
            chef_id: chefId,
            ...req.body,
            chefName: chef.name // Automatically add chef name
        });

        res.status(201).json({ message: "Recipe created successfully", recipe });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


/**
 * @swagger
 * /api/recipes:
 *   get:
 *     summary: Get all recipes with chef details
 *     description: Fetches a list of all recipes with their respective chef details.
 *     responses:
 *       200:
 *         description: A list of recipes.
 */
router.get("/", async (req, res) => {
    try {
        let { page = 1, limit = 10 } = req.query;
        page = parseInt(page);
        limit = parseInt(limit);
        const offset = (page - 1) * limit;

        const recipes = await Recipe.findAll({
            include: { model: Chef, attributes: ["name", "bio", "profile_image"] },
            limit,
            offset
        });

        res.json({ page, limit, recipes });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * @swagger
 * /api/recipes/{id}:
 *   get:
 *     summary: Get recipe by ID
 *     description: Fetches a single recipe by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Recipe details.
 *       404:
 *         description: Recipe not found.
 */
router.get("/:id", async (req, res) => {
    try {
        const recipe = await Recipe.findByPk(req.params.id, {
            include: { model: Chef, attributes: ["name", "bio", "profile_image"] } // Join with Chef details
        });

        if (!recipe) return res.status(404).json({ error: "Recipe not found" });
        res.json(recipe);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * @swagger
 * /api/recipes/{id}:
 *   put:
 *     summary: Update a recipe (Only for the owner chef)
 *     description: Modifies an existing recipe.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               recipe_name:
 *                 type: string
 *                 example: "Updated Pasta Carbonara"
 *               description:
 *                 type: string
 *                 example: "Updated recipe description..."
 *     responses:
 *       200:
 *         description: Recipe updated successfully.
 *       404:
 *         description: Recipe not found or Unauthorized.
 */
router.put("/:id", authMiddleware, validate(recipeSchema), async (req, res) => {
    try {
        const chefId = req.user.chefId;
        const recipe = await Recipe.findByPk(req.params.id);

        if (!recipe) return res.status(404).json({ error: "Recipe not found" });
        if (recipe.chef_id !== chefId) return res.status(403).json({ error: "Unauthorized to edit this recipe" });

        await recipe.update(req.body);
        res.json({ message: "Recipe updated successfully", recipe });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * @swagger
 * /api/recipes/{id}:
 *   delete:
 *     summary: Delete a recipe (Only for the owner chef)
 *     description: Removes a recipe from the database.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Recipe deleted successfully.
 *       404:
 *         description: Recipe not found or Unauthorized.
 */
router.delete("/:id", authMiddleware, async (req, res) => {
    try {
        const chefId = req.chef.chefId;
        const recipe = await Recipe.findByPk(req.params.id);

        if (!recipe) return res.status(404).json({ error: "Recipe not found" });
        if (recipe.chef_id !== chefId) return res.status(403).json({ error: "Unauthorized to delete this recipe" });

        await recipe.destroy();
        res.json({ message: "Recipe deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * @swagger
 * /api/recipes/search:
 *   get:
 *     summary: Search & Filter Recipes
 *     description: Allows users to search and filter recipes by name, category, cuisine, type, and sort by rating.
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Search by recipe name
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category (e.g., breakfast, lunch)
 *       - in: query
 *         name: cuisine
 *         schema:
 *           type: string
 *         description: Filter by cuisine type (e.g., Italian, Indian)
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *         description: Filter by Veg/Non-Veg
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *         description: Sort by field (e.g., rating, createdAt)
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: Sort order (asc or desc)
 *     responses:
 *       200:
 *         description: Returns filtered recipes.
 */
router.get("/search", searchRecipes);

module.exports = router;
