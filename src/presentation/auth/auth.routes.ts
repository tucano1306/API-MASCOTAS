import { Router } from 'express';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { validationMiddleware } from '../middlewares/validation.middleware';
import { authMiddleware } from '../middlewares/auth.middleware';
import { RegisterUserDto } from '../../domain/dtos/register-user.dto';
import { LoginUserDto } from '../../domain/dtos/login-user.dto';

export class AuthRoutes {
  static get routes(): Router {
    const router = Router();
    
    // Crear servicios
    const authService = new AuthService();
    
    // Crear controladores con inyección de dependencias
    const controller = new AuthController(authService);
    
    // Definir rutas
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
      '/validate-token',
      authMiddleware,
      controller.validateToken
    );
    
    return router;
  }
}