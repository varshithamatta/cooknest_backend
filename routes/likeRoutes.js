const express = require("express");
const router = express.Router();
const { likeRecipe, unlikeRecipe, getLikedRecipes } = require("../controllers/likeController");

/**
 * @swagger
 * /api/likes:
 *   post:
 *     summary: Like a recipe
 *     description: Allows a user to like a recipe.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: integer
 *                 example: 1
 *               recipeId:
 *                 type: integer
 *                 example: 101
 *     responses:
 *       201:
 *         description: Recipe liked successfully.
 *       400:
 *         description: Recipe already liked.
 */
router.post("/", likeRecipe);

/**
 * @swagger
 * /api/likes:
 *   delete:
 *     summary: Unlike a recipe
 *     description: Removes a like from a recipe.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: integer
 *                 example: 1
 *               recipeId:
 *                 type: integer
 *                 example: 101
 *     responses:
 *       200:
 *         description: Recipe unliked successfully.
 */
router.delete("/", unlikeRecipe);

/**
 * @swagger
 * /api/likes/{userId}:
 *   get:
 *     summary: Get liked recipes
 *     description: Fetch all recipes liked by a user.
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: List of liked recipes.
 */
router.get("/:userId", getLikedRecipes);

module.exports = router;
