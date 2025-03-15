const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Chef = require("../models/Chef");

// Chef Registration
exports.registerChef = async (req, res) => {
    try {
        const { name, email, password, bio, profile_image } = req.body;

        // Check if chef already exists
        const existingChef = await Chef.findOne({ where: { email } });
        if (existingChef) {
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

// Chef Login
exports.loginChef = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find chef by email
        const chef = await Chef.findOne({ where: { email } });
        if (!chef) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, chef.password);
        if (!isMatch) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        // Generate JWT Token
        const token = jwt.sign(
            { chefId: chef.id, email: chef.email },
            process.env.JWT_SECRET,
            { expiresIn: "2h" }
        );

        res.status(200).json({ message: "Login successful", token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
