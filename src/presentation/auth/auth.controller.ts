import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { RegisterUserDto } from '../../domain/dtos/register-user.dto';
import { LoginUserDto } from '../../domain/dtos/login-user.dto';


export class AuthController {
  constructor(
    private readonly authService: AuthService
  ) {}

  
  public register = async (req: Request, res: Response): Promise<Response> => {
    try {
      const registerDto = req.body as RegisterUserDto;
      const { user, token } = await this.authService.register(registerDto);
      
      return res.status(201).json({
        status: 'success',
        message: 'User registered successfully',
        data: { user, token }
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error registering user';
      return res.status(400).json({
        status: 'error',
        message
      });
    }
  };

  
  public login = async (req: Request, res: Response): Promise<Response> => {
    try {
      const loginDto = req.body as LoginUserDto;
      const { user, token } = await this.authService.login(loginDto);
      
      return res.status(200).json({
        status: 'success',
        message: 'Login successful',
        data: {
          user,
          token
        }
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error logging in';
      return res.status(401).json({
        status: 'error',
        message
      });
    }
  };

  
  public validateToken = async (req: Request, res: Response): Promise<Response> => {
    try {
      
      return res.status(200).json({
        status: 'success',
        message: 'Token is valid',
        data: {
          user: req.user
        }
      });
    } catch (error) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid token'
      });
    }
  };
}