const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Documentación de la API',
      version: '1.0.0',
      description: 'Documentación interactiva de los endpoints del proyecto',
    },
    servers: [
      {
        url: 'http://localhost:3000', // Cambia al puerto que uses en tu servidor
        description: 'Servidor Local',
      },
    ],
  },
  apis: ['./src/routes/*.js', './src/app.js'], // Ajusta la ruta a tus archivos de rutas
};

const swaggerSpec = swaggerJSDoc(options);

const setupSwagger = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  console.log('Swagger Docs disponible en http://localhost:3000/api-docs');
};

module.exports = setupSwagger;