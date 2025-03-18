import { Request, Response, NextFunction } from 'express';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';

export const validationMiddleware = (dto: any, skipMissingProperties = false) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    console.log('Datos recibidos:', req.body); 


    const dtoObj = plainToInstance(dto, req.body, { 
      enableImplicitConversion: true 
    });
    
    
    const errors = await validate(dtoObj, { 
      skipMissingProperties,
      whitelist: true, 
      forbidNonWhitelisted: true 
    });

    if (errors.length > 0) {
      
      const formattedErrors = errors.map((error) => ({
        property: error.property,
        constraints: error.constraints ? Object.values(error.constraints) : []
      }));

      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: formattedErrors
      });
    }

    
    req.body = dtoObj;
    next();
  };
};