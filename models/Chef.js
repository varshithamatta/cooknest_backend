const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Chef = sequelize.define("Chef", {
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },  // Hashed password
    bio: { type: DataTypes.TEXT },
    profile_image: { type: DataTypes.STRING }
}, {
    timestamps: false
});

module.exports = Chef;
