const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

// ✅ Configure Multer for Cloudinary
const storage = new CloudinaryStorage({
    cloudinary,
    params: (req, file) => {
        let folder = "cooknest";  // Default folder

        if (req.body.imageType === "userProfile") folder = "user_profiles"; // ✅ User Profile Images
        if (req.body.imageType === "profile") folder = "chef_profiles"; // ✅ Chef Profile Images
        if (req.body.imageType === "cover") folder = "chef_covers"; // ✅ Chef Cover Pages
        if (req.body.imageType === "recipe") folder = "recipes"; // ✅ Recipe Images

        return { folder, allowed_formats: ["jpg", "png", "jpeg"] };
    }
});

const upload = multer({ storage });

// ✅ Upload Image Handler
exports.uploadImage = (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: "No image uploaded" });

        res.status(200).json({
            message: "Image uploaded successfully",
            imageUrl: req.file.path
        });
    } catch (error) {
        res.status(500).json({ error: "Image upload failed" });
    }
};

module.exports = upload;
