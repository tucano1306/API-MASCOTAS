import { Router } from 'express';
import { UserRoutes } from './users/routes';
import { PetPostRoutes } from './pet-posts/routes';

export class AppRoutes {
  static get routes(): Router {
    const router = Router();

    
    router.use('/users', UserRoutes.routes);
    
  
    router.use('/pet-posts', PetPostRoutes.routes);

    return router;
  }
}