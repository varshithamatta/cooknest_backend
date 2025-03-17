const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const path = require("path");

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
                url: "http://localhost:5000",  // Local environment
                description: "Local server"
            }
            // {
            //     url: "https://your-production-url.com",  // Change this for production
            //     description: "Production server"
            // }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                    description: "Enter JWT token in the format: Bearer <your_token>"
                }
            }
        },
        security: [{ bearerAuth: [] }]  // Apply JWT authentication globally
    },
    apis: [path.join(__dirname, "routes/*.js")] // ✅ Fix for Windows & Mac compatibility
};

const swaggerSpec = swaggerJsDoc(options);

const swaggerDocs = (app) => {
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    console.log("📄 Swagger Docs available at: http://localhost:5000/api-docs");
};

module.exports = swaggerDocs;
