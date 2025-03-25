import swaggerJSDoc from 'swagger-jsdoc';
import { envs } from './envs';

const swaggerOptions: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Mascotas Perdidas',
      version: '1.0.0',
      description: 'API para gestionar publicaciones de mascotas perdidas'
    },
    servers: [
      {
        url: `/api`,
        description: 'Servidor de desarrollo'
      }
    ]
  },
  apis: [
    './src/swagger/*.ts'
  ]
};

export const swaggerSpec = swaggerJSDoc(swaggerOptions);