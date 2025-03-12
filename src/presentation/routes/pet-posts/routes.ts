import { Router } from 'express';
import { PetPostController } from '../../pet-posts/controller/controller';
import { FinderPetPostService } from '../../pet-posts/services/finder-pet-post.service';
import { FinderPetPostsService } from '../../pet-posts/services/finder-pet-posts.service';
import { CreatorPetPostService } from '../../pet-posts/services/creator-pet-post.service';
import { UpdaterPetPostService } from '../../pet-posts/services/updater-pet-post.service';
import { EliminatorPetPostService } from '../../pet-posts/services/eliminator-pet-post.service';
import { ApproverPetPostService } from '../../pet-posts/services/approver-pet-post.service';
import { RejecterPetPostService } from '../../pet-posts/services/rejecter-pet-post.service';

export class PetPostRoutes {
  static get routes(): Router {
    const router = Router();
    
    // Servicios
    const finderPetPostService = new FinderPetPostService();
    const finderPetPostsService = new FinderPetPostsService();
    const creatorPetPostService = new CreatorPetPostService();
    const updaterPetPostService = new UpdaterPetPostService();
    const eliminatorPetPostService = new EliminatorPetPostService();
    const approverPetPostService = new ApproverPetPostService();
    const rejecterPetPostService = new RejecterPetPostService();
    
    // Controlador con inyección de dependencias
    const controller = new PetPostController(
      finderPetPostService,
      finderPetPostsService,
      creatorPetPostService,
      updaterPetPostService,
      eliminatorPetPostService,
      approverPetPostService,
      rejecterPetPostService
    );
    
    // Definición de rutas de publicaciones de mascotas (ver imagen 3)
    router.post('/', controller.createPetPost);
    router.get('/', controller.findPetPosts);
    router.get('/:id', controller.findPetPost);
    router.patch('/:id', controller.updatePetPost);
    router.delete('/:id', controller.deletePetPost);
    router.patch('/:id/approve', controller.approvePetPost);
    router.patch('/:id/reject', controller.rejectPetPost);
    
    return router;
  }
}