import { Router } from 'express';
import { UserController } from '../../users/controller/controller';
import { FinderUserService } from '../../users/services/finder-user.service';
import { FinderUsersService } from '../../users/services/finder-users.service';
import { RegisterUserService } from '../../users/services/register-user.service';
import { LoginUserService } from '../../users/services/login-user.service';
import { UpdaterUserService } from '../../users/services/updater-user.service';
import { EliminatorUserService } from '../../users/services/eliminator-user.service';
import { validationMiddleware } from '../../middlewares/validation.middleware';
import { authMiddleware, roleMiddleware } from '../../middlewares/auth.middleware';
import { RegisterUserDto } from '../../../domain/dtos/register-user.dto';
import { LoginUserDto } from '../../../domain/dtos/login-user.dto';
import { UpdateUserDto } from '../../../domain/dtos/update-user.dto';
import { UserRole } from '../../../data/postgres/models/user.model';

export class UserRoutes {
  static get routes(): Router {
    const router = Router();
    
    
    const finderUserService = new FinderUserService();
    const finderUsersService = new FinderUsersService();
    const registerUserService = new RegisterUserService();
    const loginUserService = new LoginUserService();
    const updaterUserService = new UpdaterUserService();
    const eliminatorUserService = new EliminatorUserService();
    
    
    const controller = new UserController(
      finderUserService,
      finderUsersService,
      registerUserService,
      loginUserService,
      updaterUserService,
      eliminatorUserService
    );
    
    
    router.post(
      '/register', 
      validationMiddleware(RegisterUserDto),
      controller.register
    );
    
    router.post(
      '/login', 
      validationMiddleware(LoginUserDto),
      controller.login
    );
    
    
    router.get(
      '/', 
      authMiddleware,
      roleMiddleware([UserRole.ADMIN]),
      controller.findUsers
    );
    
    router.get(
      '/:id', 
      authMiddleware,
      controller.findUser
    );
    
    router.patch(
      '/:id', 
      authMiddleware,
      validationMiddleware(UpdateUserDto, true),
      controller.updateUser
    );
    
    router.delete(
      '/:id', 
      authMiddleware,
      roleMiddleware([UserRole.ADMIN]),
      controller.deleteUser
    );
    
    return router;
  }
}