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
      return res.status(500).json({ message: 'Internal server error' });
    }
  };

  login = async (req: Request, res: Response) => {
    
    return res.status(501).json({ message: 'not yet implemented' });
  };

  
  findUsers = async (req: Request, res: Response) => {
    try {
      const result = await this.finderUsersService.execute();
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ message: 'Internal server error' });
    }
  };

  findUser = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const result = await this.finderUserService.execute(id);
      
      if (!result) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ message: 'Internal server error' });
    }
  };

  
  updateUser = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const result = await this.updaterUserService.execute(id, req.body);
      
      if (!result) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ message: 'Internal server error' });
    }
  };


  deleteUser = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const result = await this.eliminatorUserService.execute(id);
      
      if (!result) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      return res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
      return res.status(500).json({ message: 'Internal server error' });
    }
  };
}