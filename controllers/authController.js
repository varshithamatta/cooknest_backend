const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Chef = require("../models/Chef");
const User = require("../models/User");

// Chef Registration
exports.registerChef = async (req, res) => {
    try {
        const { name, email, password, bio, profile_image } = req.body;

        // Check if email already exists
        const existingChef = await Chef.findOne({ where: { email } });
        const existingUser = await User.findOne({ where: { email } }); // Also check in User table
        if (existingChef || existingUser) {
            return res.status(400).json({ error: "Email already in use" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new chef
        const chef = await Chef.create({ name, email, password: hashedPassword, bio, profile_image });

        res.status(201).json({ message: "Chef registered successfully", chef });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// User Registration
exports.registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if email already exists
        const existingChef = await Chef.findOne({ where: { email } });
        const existingUser = await User.findOne({ where: { email } });
        if (existingChef || existingUser) {
            return res.status(400).json({ error: "Email already in use" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const user = await User.create({ name, email, password: hashedPassword });

        res.status(201).json({ message: "User registered successfully", user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Unified Login for Users & Chefs
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if email belongs to a Chef
        let user = await Chef.findOne({ where: { email } });
        let role = "chef";

        // If not a Chef, check if it's a normal User
        if (!user) {
            user = await User.findOne({ where: { email } });
            role = "user";
        }

        if (!user) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        // Validate Password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        // Generate JWT Token
        const token = jwt.sign(
            { id: user.id, email: user.email, role },
            process.env.JWT_SECRET,
            { expiresIn: "2h" }
        );

        res.status(200).json({
            message: "Login successful",
            token,
            role, // Send the role in the response
            profile: user // Send user/chef details
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
