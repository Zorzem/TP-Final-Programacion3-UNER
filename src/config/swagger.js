// src/config/swagger.js

import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API de Reservas",
      version: "1.0.0",
      description: "Documentación de la API del sistema de reservas",
    },
    servers: [
      {
        url: "http://localhost:3000/api/v1",
        description: "Servidor local",
      },
    ],
  },
  apis: ["./src/v1/routes/*.js"], // acá van las rutas
};

const swaggerSpec = swaggerJSDoc(options);

export { swaggerUi, swaggerSpec };
