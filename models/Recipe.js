const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Chef = require("./Chef");

const Recipe = sequelize.define("Recipe", {
    recipe_name: { type: DataTypes.STRING, allowNull: false },
    image: { type: DataTypes.STRING },
    category: { 
        type: DataTypes.ENUM("Breakfast", "Lunch", "Dinner", "Snack", "Dessert") 
    },
    cuisine_type: { type: DataTypes.STRING },
    rating: { type: DataTypes.DOUBLE, defaultValue: 0 },
    time: { type: DataTypes.STRING },
    type: { type: DataTypes.ENUM("Veg", "Non-Veg") },
    description: { type: DataTypes.TEXT },
    ingredients: { type: DataTypes.JSON },  // Storing as JSON
    instructions: { type: DataTypes.JSON }, // Storing as JSON
    liked: { type: DataTypes.BOOLEAN, defaultValue: false },
    chefName: { type: DataTypes.STRING }
}, {
    timestamps: false,
});

Recipe.belongsTo(Chef, { foreignKey: "chef_id", onDelete: "CASCADE" });
Chef.hasMany(Recipe, { foreignKey: "chef_id" });

module.exports = Recipe;
