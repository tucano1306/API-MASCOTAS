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
    
    
    const authService = new AuthService();
    
  
    const controller = new AuthController(authService);
    
    
    router.post(
      '/register',
      validationMiddleware(RegisterUserDto),
      (req, res, next) => {
        
        controller.register(req, res).catch(next);
      }
    );
    
    router.post(
      '/login',
      validationMiddleware(LoginUserDto),
      (req, res, next) => {
        controller.login(req, res).catch(next);
      }
    );
    
    router.get(
      '/validate-token',
      authMiddleware,
      (req, res, next) => {
        controller.validateToken(req, res).catch(next);
      }
    );
    
    return router;
  }
}