const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { likeRecipe, unlikeRecipe, getLikedRecipes } = require("../controllers/likeController");
const validate = require("../middleware/validate");
const { likeRecipeSchema } = require("../validators/schemas");

/**
 * @swagger
 * /api/likes:
 *   post:
 *     summary: Like a recipe (Protected)
 *     description: Allows a logged-in user to like a recipe.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               recipe_id:
 *                 type: integer
 *                 example: 101
 *     responses:
 *       201:
 *         description: Recipe liked successfully.
 *       400:
 *         description: Recipe already liked or invalid request.
 */
router.post("/", authMiddleware, validate(likeRecipeSchema), likeRecipe);

/**
 * @swagger
 * /api/likes/{recipe_id}:
 *   delete:
 *     summary: Unlike a recipe (Protected)
 *     description: Removes a like from a recipe.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: recipe_id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 101
 *     responses:
 *       200:
 *         description: Recipe unliked successfully.
 *       400:
 *         description: Invalid recipe ID.
 *       404:
 *         description: Recipe not found in liked list.
 */
router.delete("/:recipe_id", authMiddleware, async (req, res, next) => {
    const recipeId = parseInt(req.params.recipe_id);
    if (isNaN(recipeId) || recipeId <= 0) {
        return res.status(400).json({ error: "Invalid recipe ID" });
    }
    next();
}, unlikeRecipe);

/**
 * @swagger
 * /api/likes:
 *   get:
 *     summary: Get liked recipes for the logged-in user (Protected)
 *     description: Fetch all recipes liked by the authenticated user.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of liked recipes with details.
 */
router.get("/", authMiddleware, getLikedRecipes);

module.exports = router;
