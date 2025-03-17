const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
const sequelize = require("./config/database");
const swaggerDocs = require("./swaggerConfig");

// Import Routes
const authRoutes = require("./routes/authRoutes");   // ✅ Added Authentication Routes
const recipeRoutes = require("./routes/recipeRoutes");
const chefRoutes = require("./routes/chefRoutes");
const userRoutes = require("./routes/userRoutes");
const likeRoutes = require("./routes/likeRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// API Routes
app.use("/api/auth", authRoutes);    // ✅ Added Authentication Routes
app.use("/api/recipes", recipeRoutes);
app.use("/api/chefs", chefRoutes);
app.use("/api/users", userRoutes);
app.use("/api/likes", likeRoutes);

// ✅ Simple Health Check Route
app.get("/api/health", (req, res) => {
    res.status(200).json({ status: "API is running fine!" });
});

// Initialize Swagger
swaggerDocs(app);

// Start Server
const PORT = process.env.PORT || 5000;
sequelize.sync()
    .then(() => {
        app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
    })
    .catch((err) => {
        console.error("❌ Database connection failed:", err);
    });
