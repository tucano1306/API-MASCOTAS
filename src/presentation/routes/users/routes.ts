import { Router } from 'express';
import { UserController } from '../../users/controller/controller';
import { FinderUserService } from '../../users/services/finder-user.service';
import { FinderUsersService } from '../../users/services/finder-users.service';
import { RegisterUserService } from '../../users/services/register-user.service';
import { LoginUserService } from '../../users/services/login-user.service';
import { UpdaterUserService } from '../../users/services/updater-user.service';
import { EliminatorUserService } from '../../users/services/eliminator-user.service';

export class UserRoutes {
  static get routes(): Router {
    const router = Router();
    
    // Servicios
    const finderUserService = new FinderUserService();
    const finderUsersService = new FinderUsersService();
    const registerUserService = new RegisterUserService();
    const loginUserService = new LoginUserService();
    const updaterUserService = new UpdaterUserService();
    const eliminatorUserService = new EliminatorUserService();
    
    // Controlador con inyección de dependencias
    const controller = new UserController(
      finderUserService,
      finderUsersService,
      registerUserService,
      loginUserService,
      updaterUserService,
      eliminatorUserService
    );
    
    // Definición de rutas de usuarios (ver imagen 2)
    router.post('/register', controller.register);
    router.post('/login', controller.login);
    router.get('/', controller.findUsers);
    router.get('/:id', controller.findUser);
    router.patch('/:id', controller.updateUser);
    router.delete('/:id', controller.deleteUser);
    
    return router;
  }
}