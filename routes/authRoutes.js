const express = require("express");
const { registerChef, registerUser, login } = require("../controllers/authController");
const validate = require("../middleware/validate");
const { registerSchema, loginSchema } = require("../validators/schemas");

const router = express.Router();

/**
 * @swagger
 * /api/auth/register-chef:
 *   post:
 *     summary: Register as a Chef
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
router.post("/register-chef", validate(registerSchema), registerChef);

/**
 * @swagger
 * /api/auth/register-user:
 *   post:
 *     summary: Register as a User
 *     description: Creates a new user account.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "John Doe"
 *               email:
 *                 type: string
 *                 example: "johndoe@example.com"
 *               password:
 *                 type: string
 *                 example: "securepassword"
 *     responses:
 *       201:
 *         description: User registered successfully.
 */
router.post("/register-user", validate(registerSchema), registerUser);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login for both Users & Chefs
 *     description: Authenticates a user or chef and returns a JWT token with role.
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
 *         description: Login successful, returns token and user/chef details.
 */
router.post("/login", validate(loginSchema), login);

module.exports = router;
