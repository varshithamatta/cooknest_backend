const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "CookNest API",
            version: "1.0.0",
            description: "API documentation for the Recipe Finder App",
        },
        servers: [
            {
                url: "http://localhost:5000",  // Update this if needed
                description: "Local server"
            }
        ]
    },
    apis: ["./routes/*.js"]  // Path to your route files
};

const swaggerSpec = swaggerJsDoc(options);

const swaggerDocs = (app) => {
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    console.log("📄 Swagger Docs available at: http://localhost:5000/api-docs");
};

module.exports = swaggerDocs;
