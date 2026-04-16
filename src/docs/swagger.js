const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'HabTrack API',
      version: '1.0.0',
      description:
        'API REST para controle de habitos com cadastro, login, CRUD de habitos e marcacao diaria.',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor local',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        RegisterRequest: {
          type: 'object',
          required: ['name', 'email', 'password'],
          properties: {
            name: { type: 'string', example: 'Luana' },
            email: { type: 'string', example: 'luana@email.com' },
            password: { type: 'string', example: '123456' },
          },
        },
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', example: 'luana@email.com' },
            password: { type: 'string', example: '123456' },
          },
        },
        HabitRequest: {
          type: 'object',
          required: ['name'],
          properties: {
            name: { type: 'string', example: 'Beber agua' },
            description: { type: 'string', example: 'Tomar 2 litros por dia' },
          },
        },
        HabitStatusRequest: {
          type: 'object',
          required: ['completed'],
          properties: {
            completed: { type: 'boolean', example: true },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.js'],
};

module.exports = swaggerJSDoc(options);
