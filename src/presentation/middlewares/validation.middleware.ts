import { Request, Response, NextFunction } from 'express';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';

export const validationMiddleware = (dto: any, skipMissingProperties = false) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Convertir el objeto de la solicitud (req.body) a la instancia del DTO
    const dtoObj = plainToInstance(dto, req.body);
    
    // Validar el DTO con class-validator
    const errors = await validate(dtoObj, { skipMissingProperties });

    if (errors.length > 0) {
      // Extraer y formatear los errores de validación
      const formattedErrors = errors.map((error) => {
        const constraints = error.constraints ? Object.values(error.constraints) : [];
        return {
          property: error.property,
          errors: constraints
        };
      });

      // Enviar respuesta con errores de validación
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: formattedErrors
      });
    }

    // Asignar el objeto validado al req.body
    req.body = dtoObj;
    next();
  };
};