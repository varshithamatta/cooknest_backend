const User = require("../models/User");

// Get All Users (Protected)
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get User by ID (Protected)
exports.getUserById = async (req, res) => {
    try {
        const userId = req.params.id;

        // Ensure the requested user matches the authenticated user
        if (req.user.role !== "user" || req.user.id !== parseInt(userId)) {
            return res.status(403).json({ error: "Unauthorized access" });
        }

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update User Profile (Protected)
exports.updateUser = async (req, res) => {
    try {
        const userId = req.params.id;

        // Ensure the requested user matches the authenticated user
        if (req.user.role !== "user" || req.user.id !== parseInt(userId)) {
            return res.status(403).json({ error: "Unauthorized access" });
        }

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        await user.update(req.body);
        res.json({ message: "User updated successfully", user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete User Account (Protected)
exports.deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;

        // Ensure the requested user matches the authenticated user
        if (req.user.role !== "user" || req.user.id !== parseInt(userId)) {
            return res.status(403).json({ error: "Unauthorized access" });
        }

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        await user.destroy();
        res.json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateUserProfile = async (req, res) => {
    try {
        const { profile_image } = req.body;
        const userId = req.params.id;

        // Ensure the logged-in user is updating their own profile
        if (req.user.role !== "user" || req.user.id !== parseInt(userId)) {
            return res.status(403).json({ error: "Unauthorized access" });
        }

        const user = await User.findByPk(userId);
        if (!user) return res.status(404).json({ error: "User not found" });

        // ✅ Update Profile Image if Provided
        if (profile_image) user.profile_image = profile_image;

        await user.save();
        res.status(200).json({ message: "User profile updated", user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
