import { Router } from 'express';
import { UserRoutes } from './users/routes';
import { PetPostRoutes } from './pet-posts/routes';

export class AppRoutes {
  static get routes(): Router {
    const router = Router();

    // Rutas de usuarios
    router.use('/users', UserRoutes.routes);
    
    // Rutas de publicaciones de mascotas
    router.use('/pet-posts', PetPostRoutes.routes);

    return router;
  }
}