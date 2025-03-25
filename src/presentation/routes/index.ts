import { Router } from 'express';
import { UserRoutes } from './users/routes';
import { PetPostRoutes } from './pet-posts/routes';
import { AuthRoutes } from '../auth/auth.routes';
import swaggerUI from 'swagger-ui-express';
import { swaggerSpec } from '../../config/swagger';

export class AppRoutes {
  static get routes(): Router {
    const router = Router();

    // Configuración de Swagger - colócala ANTES de tus otras rutas
    router.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));
    
    // Rutas existentes
    router.use('/auth', AuthRoutes.routes);
    router.use('/users', UserRoutes.routes);
    router.use('/pet-posts', PetPostRoutes.routes);

    return router;
  }
}