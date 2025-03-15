const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const Chef = require("../models/Chef");


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

// ✅ Get Chef by ID (With Recipes)
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
 *     summary: Update a chef profile
 *     description: Updates a chef's profile information.
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
 *       404:
 *         description: Chef not found.
 */
router.put("/:id", async (req, res) => {
    try {
        const chef = await Chef.findByPk(req.params.id);
        if (!chef) return res.status(404).json({ error: "Chef not found" });

        await chef.update(req.body);
        res.json(chef);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

/**
 * @swagger
 * /api/chefs/{id}:
 *   delete:
 *     summary: Delete a chef
 *     description: Removes a chef from the database.
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
 *       404:
 *         description: Chef not found.
 */
router.delete("/:id", async (req, res) => {
    try {
        const chef = await Chef.findByPk(req.params.id);
        if (!chef) return res.status(404).json({ error: "Chef not found" });

        await chef.destroy();
        res.json({ message: "Chef deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
