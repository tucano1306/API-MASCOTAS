import { Request, Response } from 'express';
import { FinderUserService } from '../services/finder-user.service';
import { FinderUsersService } from '../services/finder-users.service';
import { RegisterUserService } from '../services/register-user.service';
import { LoginUserService } from '../services/login-user.service';
import { UpdaterUserService } from '../services/updater-user.service';
import { EliminatorUserService } from '../services/eliminator-user.service';

export class UserController {
  constructor(
    private readonly finderUserService: FinderUserService,
    private readonly finderUsersService: FinderUsersService,
    private readonly registerUserService: RegisterUserService,
    private readonly loginUserService: LoginUserService,
    private readonly updaterUserService: UpdaterUserService,
    private readonly eliminatorUserService: EliminatorUserService
  ) {}

  register = async (req: Request, res: Response) => {
    try {
      const result = await this.registerUserService.execute(req.body);
      return res.status(201).json(result);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error interno del servidor';
      return res.status(500).json({ 
        status: 'error',
        message 
      });
    }
  };

  login = async (req: Request, res: Response) => {
    try {
      const result = await this.loginUserService.execute(req.body);
      return res.status(200).json(result);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error de autenticación';
      return res.status(401).json({ 
        status: 'error', 
        message 
      });
    }
  };

  findUsers = async (req: Request, res: Response) => {
    try {
      const result = await this.finderUsersService.execute();
      return res.status(200).json({
        status: 'success',
        data: result
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error interno del servidor';
      return res.status(500).json({ 
        status: 'error',
        message 
      });
    }
  };

  findUser = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const result = await this.finderUserService.execute(id);
      
      if (!result) {
        return res.status(404).json({
          status: 'error',
          message: 'Usuario no encontrado'
        });
      }
      
      return res.status(200).json({
        status: 'success',
        data: result
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error interno del servidor';
      return res.status(500).json({ 
        status: 'error',
        message 
      });
    }
  };

  updateUser = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      
      
      if (id !== req.user!.id && req.user!.role !== 'admin') {
        return res.status(403).json({
          status: 'error',
          message: 'No tienes permiso para actualizar este usuario'
        });
      }
      
      const result = await this.updaterUserService.execute(id, req.body);
      
      if (!result) {
        return res.status(404).json({
          status: 'error',
          message: 'Usuario no encontrado'
        });
      }
      
      return res.status(200).json({
        status: 'success',
        message: 'Usuario actualizado exitosamente',
        data: result
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error interno del servidor';
      return res.status(500).json({ 
        status: 'error',
        message 
      });
    }
  };

  deleteUser = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const result = await this.eliminatorUserService.execute(id);
      
      if (!result) {
        return res.status(404).json({
          status: 'error',
          message: 'Usuario no encontrado'
        });
      }
      
      return res.status(200).json({
        status: 'success',
        message: 'Usuario eliminado exitosamente'
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error interno del servidor';
      return res.status(500).json({ 
        status: 'error',
        message 
      });
    }
  };
}