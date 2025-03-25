import swaggerJSDoc from 'swagger-jsdoc';
import { envs } from './envs';

const swaggerOptions: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Mascotas Perdidas',
      version: '1.0.0',
      description: 'API para gestionar publicaciones de mascotas perdidas y facilitar su búsqueda',
      contact: {
        name: 'Tu Nombre',
        email: 'tu@email.com'
      }
    },
    servers: [
      {
        url: `http://localhost:${envs.PORT}/api`,
        description: 'Servidor de desarrollo'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            status: {
              type: 'string',
              example: 'error'
            },
            message: {
              type: 'string',
              example: 'Mensaje de error'
            }
          }
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ],
    tags: [
      {
        name: 'Auth',
        description: 'Endpoints de autenticación'
      },
      {
        name: 'Users',
        description: 'Operaciones relacionadas con usuarios'
      },
      {
        name: 'PetPosts',
        description: 'Operaciones relacionadas con publicaciones de mascotas'
      }
    ]
  },
  apis: [
    './src/presentation/routes/**/*.ts',
    './src/domain/dtos/**/*.ts',
    './src/data/postgres/models/**/*.ts',
    './src/presentation/auth/**/*.ts',
    './src/presentation/pet-posts/**/*.ts',
    './src/presentation/users/**/*.ts',
    './src/swagger/*.ts'
  ]
};

export const swaggerSpec = swaggerJSDoc(swaggerOptions);