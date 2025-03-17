const sequelize = require("./config/database");
const Chef = require("./models/Chef");
const Recipe = require("./models/Recipe");

// ✅ Add All Models Here
const User = require("./models/User");
const LikedRecipe = require("./models/LikedRecipe");

const syncDB = async () => {
    try {
        await sequelize.sync({ alter: true }); // ✅ Keeps existing data but updates schema
        console.log("✅ Database synced successfully!");
    } catch (err) {
        console.error("❌ Error syncing database:", err);
    }
};

syncDB();
