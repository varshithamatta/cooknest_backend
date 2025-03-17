const Joi = require("joi");

// ✅ User & Chef Registration Schema
const registerSchema = Joi.object({
    name: Joi.string().min(3).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    bio: Joi.string().max(500).optional(),
    profile_image: Joi.string().uri().optional(),
    cover_image: Joi.string().uri().optional()
});

// ✅ Login Schema
const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
});

// ✅ Recipe Schema
const recipeSchema = Joi.object({
    chef_id: Joi.number().integer().required(),
    recipe_name: Joi.string().min(3).max(100).required(),
    image: Joi.string().uri().optional(),
    category: Joi.string().valid("breakfast", "lunch", "dinner", "snack", "dessert").required(),
    cuisine_type: Joi.string().required(),
    type: Joi.string().valid("veg", "non-veg").required(),
    description: Joi.string().min(10).max(1000).required(),
    ingredients: Joi.array().items(Joi.string()).min(1).required(),
    instructions: Joi.array().items(Joi.string()).min(1).required()
});

// ✅ Liked Recipe Schema
const likeRecipeSchema = Joi.object({
    recipe_id: Joi.number().integer().required()
});

module.exports = {
    registerSchema,
    loginSchema,
    recipeSchema,
    likeRecipeSchema
};
