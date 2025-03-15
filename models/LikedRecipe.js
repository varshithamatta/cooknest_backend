const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./User");
const Recipe = require("./Recipe");

const LikedRecipe = sequelize.define("LikedRecipe", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    }
}, {
    timestamps: true
});

// Relationships
User.belongsToMany(Recipe, { through: LikedRecipe, foreignKey: "user_id" });
Recipe.belongsToMany(User, { through: LikedRecipe, foreignKey: "recipe_id" });

module.exports = LikedRecipe;
