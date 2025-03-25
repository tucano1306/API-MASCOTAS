import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { envs } from '../../config/envs';
import { UserRole } from '../../data/postgres/models/user.model';


declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: UserRole;
      };
    }
  }
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  
  const authHeader = req.header('Authorization');
  const token = authHeader?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({
      status: 'error',
      message: 'Autenticación requerida - Token no proporcionado'
    });
  }

  try {
    
    const decoded = jwt.verify(token, envs.JWT_SECRET) as {
      id: string;
      email: string;
      role: UserRole;
    };
    
    
    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role
    };
    
    next();
  } catch (error) {
    return res.status(401).json({
      status: 'error',
      message: 'Token inválido o expirado'
    });
  }
};


export const roleMiddleware = (allowedRoles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        status: 'error',
        message: 'Autenticación requerida'
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        status: 'error',
        message: 'No tienes permiso para realizar esta acción'
      });
    }

    next();
  };
};