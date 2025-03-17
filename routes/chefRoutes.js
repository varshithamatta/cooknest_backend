const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const Chef = require("../models/Chef");
const { getChefStats } = require("../controllers/chefController");

/**
 * @swagger
 * /api/chefs/{id}/stats:
 *   get:
 *     summary: Get chef analytics (Protected)
 *     description: Returns the total recipes and total likes received by a chef.
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
 *         description: Returns total recipes and total likes.
 *       404:
 *         description: Chef not found.
 */
router.get("/:id/stats", authMiddleware, getChefStats);

/**
 * @swagger
 * /api/chefs:
 *   get:
 *     summary: Get all chefs
 *     description: Fetches a list of all registered chefs.
 *     responses:
 *       200:
 *         description: A list of chefs.
 */
router.get("/", async (req, res) => {
    try {
        const chefs = await Chef.findAll();
        res.json(chefs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * @swagger
 * /api/chefs/{id}:
 *   get:
 *     summary: Get a chef by ID
 *     description: Fetches details of a chef along with their recipes.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Chef details retrieved successfully.
 *       404:
 *         description: Chef not found.
 */
router.get("/:id", async (req, res) => {
    try {
        const chef = await Chef.findByPk(req.params.id, { include: ["Recipes"] });
        if (!chef) return res.status(404).json({ error: "Chef not found" });
        res.json(chef);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * @swagger
 * /api/chefs/{id}:
 *   put:
 *     summary: Update a chef profile (Only the chef can update their profile)
 *     description: Updates a chef's profile information.
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
 *               name:
 *                 type: string
 *                 example: "Updated Chef Name"
 *               bio:
 *                 type: string
 *                 example: "Updated bio for the chef..."
 *     responses:
 *       200:
 *         description: Chef updated successfully.
 *       403:
 *         description: Unauthorized (only the chef can update their profile).
 *       404:
 *         description: Chef not found.
 */
router.put("/:id", authMiddleware, async (req, res) => {
    try {
        // Ensure the logged-in chef is updating their own profile
        if (req.chef.role !== "chef" || req.chef.id !== parseInt(req.params.id)) {
            return res.status(403).json({ error: "Unauthorized to update this profile" });
        }

        const chef = await Chef.findByPk(req.params.id);
        if (!chef) return res.status(404).json({ error: "Chef not found" });

        await chef.update(req.body);
        res.json({ message: "Chef profile updated successfully", chef });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

/**
 * @swagger
 * /api/chefs/{id}:
 *   delete:
 *     summary: Delete a chef (Only the chef can delete their profile)
 *     description: Removes a chef from the database.
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
 *         description: Chef deleted successfully.
 *       403:
 *         description: Unauthorized (only the chef can delete their profile).
 *       404:
 *         description: Chef not found.
 */
router.delete("/:id", authMiddleware, async (req, res) => {
    try {
        // Ensure the logged-in chef is deleting their own profile
        if (req.chef.role !== "chef" || req.chef.id !== parseInt(req.params.id)) {
            return res.status(403).json({ error: "Unauthorized to delete this profile" });
        }

        const chef = await Chef.findByPk(req.params.id);
        if (!chef) return res.status(404).json({ error: "Chef not found" });

        await chef.destroy();
        res.json({ message: "Chef profile deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
