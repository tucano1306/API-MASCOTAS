import { Router } from 'express';
import { UserRoutes } from './users/routes';
import { PetPostRoutes } from './pet-posts/routes';
import { AuthRoutes } from '../auth/auth.routes';

export class AppRoutes {
  static get routes(): Router {
    const router = Router();

    // Rutas de autenticación
    router.use('/auth', AuthRoutes.routes);
    
    // Rutas de usuarios
    router.use('/users', UserRoutes.routes);
    
    // Rutas de publicaciones de mascotas
    router.use('/pet-posts', PetPostRoutes.routes);

    return router;
  }
}