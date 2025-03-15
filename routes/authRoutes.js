const express = require("express");
const { registerChef, loginChef } = require("../controllers/authController");
const router = express.Router();

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new chef
 *     description: Creates a new chef account.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Chef John"
 *               email:
 *                 type: string
 *                 example: "chefjohn@example.com"
 *               password:
 *                 type: string
 *                 example: "securepassword"
 *               bio:
 *                 type: string
 *                 example: "Expert in Italian cuisine"
 *               profile_image:
 *                 type: string
 *                 example: "https://example.com/profile.jpg"
 *     responses:
 *       201:
 *         description: Chef registered successfully.
 */
router.post("/register", registerChef);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Chef login
 *     description: Authenticates a chef and returns a JWT token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "chefjohn@example.com"
 *               password:
 *                 type: string
 *                 example: "securepassword"
 *     responses:
 *       200:
 *         description: Login successful, returns token.
 *       401:
 *         description: Invalid credentials.
 */
router.post("/login", loginChef);

module.exports = router;
