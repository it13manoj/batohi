const swaggerJsdoc = require("swagger-jsdoc");

const options = {
    definition: {
        openapi: "3.0.0",

        info: {
            title: "Batohi API",
            version: "1.0.0",
            description: "Batohi Backend API Documentation"
        },

        servers: [
            {
                url: "http://localhost:2600"
            }
        ],

        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT"
                }
            }
        }
    },

   apis: [
    "./Src/Routes/*.js",
    "./Src/swagger/*.swagger.js"
]
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;