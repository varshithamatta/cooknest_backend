const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { getAllUsers, getUserById, updateUser, deleteUser, updateUserProfile } = require("../controllers/UserController");

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users (Protected)
 *     description: Retrieves a list of all registered users. Only accessible to authorized users.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of users.
 */
router.get("/", authMiddleware, getAllUsers);

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Get user by ID (Protected)
 *     description: Fetches a user profile by ID. Users can only view their own profile.
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
 *         description: User details retrieved successfully.
 *       403:
 *         description: Unauthorized access.
 *       404:
 *         description: User not found.
 */
router.get("/:id", authMiddleware, getUserById);

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Update user profile (Protected)
 *     description: Allows a user to update their profile.
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
 *                 example: "Updated User Name"
 *               email:
 *                 type: string
 *                 example: "updatedemail@example.com"
 *     responses:
 *       200:
 *         description: User profile updated successfully.
 *       403:
 *         description: Unauthorized access.
 *       404:
 *         description: User not found.
 */
router.put("/:id", authMiddleware, updateUser);

/**
 * @swagger
 * /api/users/{id}/profile:
 *   put:
 *     summary: Update user profile image (Protected)
 *     description: Allows a user to update their profile image.
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
 *               profile_image:
 *                 type: string
 *                 example: "https://example.com/profile.jpg"
 *     responses:
 *       200:
 *         description: Profile image updated successfully.
 *       403:
 *         description: Unauthorized access.
 *       404:
 *         description: User not found.
 */
router.put("/:id/profile", authMiddleware, updateUserProfile);

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Delete user account (Protected)
 *     description: Allows a user to delete their account.
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
 *         description: User deleted successfully.
 *       403:
 *         description: Unauthorized access.
 *       404:
 *         description: User not found.
 */
router.delete("/:id", authMiddleware, deleteUser);

module.exports = router;
