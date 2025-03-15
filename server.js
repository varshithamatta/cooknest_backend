const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
const sequelize = require("./config/database");
const swaggerDocs = require("./swaggerConfig");

// Import Routes
const recipeRoutes = require("./routes/recipeRoutes");
const chefRoutes = require("./routes/chefRoutes");
const userRoutes = require("./routes/userRoutes"); // ✅ Added User Routes
const likeRoutes = require("./routes/likeRoutes"); // ✅ Added Liked Recipes Routes

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// API Routes
app.use("/api/recipes", recipeRoutes);
app.use("/api/chefs", chefRoutes);
app.use("/api/users", userRoutes);    // ✅ Added User Routes
app.use("/api/likes", likeRoutes);    // ✅ Added Liked Recipes Routes

// Initialize Swagger
swaggerDocs(app);

// Start Server
const PORT = process.env.PORT || 5000;
sequelize.sync().then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
