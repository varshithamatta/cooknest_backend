const express = require("express");
const router = express.Router();
const upload = require("../controllers/uploadController");

/**
 * @swagger
 * /api/upload:
 *   post:
 *     summary: Upload an image (Profile, Cover, Recipe Image)
 *     description: Uploads an image to Cloudinary and returns the image URL.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               imageType:
 *                 type: string
 *                 enum: ["profile", "cover", "recipe"]
 *                 example: "profile"
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Image uploaded successfully.
 */
router.post("/", upload.single("image"), upload.uploadImage);

module.exports = router;
