const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: "mysql",
        port: process.env.DB_PORT,
        logging: false, // Set true if you want SQL logs in console
    }
);

sequelize.authenticate()
    .then(() => console.log("Database connected"))
    .catch(err => console.log("Error: " + err));

module.exports = sequelize;
