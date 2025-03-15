const sequelize = require("./config/database");
const Chef = require("./models/Chef");
const Recipe = require("./models/Recipe");

const syncDB = async () => {
    try {
        await sequelize.sync({ force: true }); // Set false after first run
        console.log("Database synced!");
    } catch (err) {
        console.error("Error syncing database:", err);
    }
};

syncDB();
