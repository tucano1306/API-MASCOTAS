import { Router } from 'express';
import { PetPostController } from '../../pet-posts/controller/controller';
import { FinderPetPostService } from '../../pet-posts/services/finder-pet-post.service';
import { FinderPetPostsService } from '../../pet-posts/services/finder-pet-posts.service';
import { CreatorPetPostService } from '../../pet-posts/services/creator-pet-post.service';
import { UpdaterPetPostService } from '../../pet-posts/services/updater-pet-post.service';
import { EliminatorPetPostService } from '../../pet-posts/services/eliminator-pet-post.service';
import { ApproverPetPostService } from '../../pet-posts/services/approver-pet-post.service';
import { RejecterPetPostService } from '../../pet-posts/services/rejecter-pet-post.service';
import { authMiddleware, roleMiddleware } from '../../middlewares/auth.middleware';
import { UserRole } from '../../../data/postgres/models/user.model';
import { validationMiddleware } from '../../middlewares/validation.middleware';
import { CreatePetPostDto } from '../../dtos/create-pet-post.dto';
import { UpdatePetPostDto } from '../../dtos/update-pet-post.dto';
import { ApproveRejectPetPostDto } from '../../dtos/approve-reject-pet-post.dto';

export class PetPostRoutes {
  static get routes(): Router {
  
    const router = Router();
    
    
    const finderPetPostService = new FinderPetPostService();
    const finderPetPostsService = new FinderPetPostsService();
    const creatorPetPostService = new CreatorPetPostService();
    const updaterPetPostService = new UpdaterPetPostService();
    const eliminatorPetPostService = new EliminatorPetPostService();
    const approverPetPostService = new ApproverPetPostService();
    const rejecterPetPostService = new RejecterPetPostService();
    
    
    const controller = new PetPostController(
      finderPetPostService,
      finderPetPostsService,
      creatorPetPostService,
      updaterPetPostService,
      eliminatorPetPostService,
      approverPetPostService,
      rejecterPetPostService
    );
    
    
    router.post(
      '/', 
      authMiddleware,
      validationMiddleware(CreatePetPostDto),
      controller.createPetPost
    );
    
    router.get(
      '/', 
      authMiddleware,
      controller.findPetPosts
    );
    
    router.get(
      '/:id', 
      authMiddleware,
      controller.findPetPost
    );
    
    router.patch(
      '/:id', 
      authMiddleware,
      validationMiddleware(UpdatePetPostDto, true),
      controller.updatePetPost
    );
    
    router.delete(
      '/:id', 
      authMiddleware,
      controller.deletePetPost
    );
    
    router.patch(
      '/:id/approve', 
      authMiddleware,
      roleMiddleware([UserRole.ADMIN]),
      controller.approvePetPost
    );
    
    router.patch(
      '/:id/reject', 
      authMiddleware,
      roleMiddleware([UserRole.ADMIN]),
      controller.rejectPetPost
    );
    
    return router;
  }
}