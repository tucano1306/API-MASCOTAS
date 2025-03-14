import { compare, hash } from 'bcryptjs';
import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import { User, UserRole } from '../../data/postgres/models/user.model';
import { RepositoryService } from '../../data/postgres/repository.service';
import { envs } from '../../config/envs';
import { RegisterUserDto } from '../../domain/dtos/register-user.dto';
import { LoginUserDto } from '../../domain/dtos/login-user.dto';

interface JwtPayload {
  id: string;
  email: string;
  role: UserRole;
}

export class AuthService {
  private readonly userRepository;

  constructor() {
    const repoService = RepositoryService.getInstance();
    this.userRepository = repoService.getUserRepository();
  }

  /**
   * Genera un token JWT
   */
  private generateJwt(payload: JwtPayload): string {
    return jwt.sign(
      payload, 
      envs.JWT_SECRET as Secret, // Usa una aserción de tipo
      {
        expiresIn: envs.JWT_EXPIRES_IN
      } as SignOptions // Aserción de tipo para las opciones
    );
  }

  /**
   * Inicia sesión con un usuario existente
   */
  public async login(loginDto: LoginUserDto): Promise<{ user: Partial<User>; token: string }> {
    try {
      // Buscar el usuario por email
      const user = await this.userRepository.findOne({
        where: { email: loginDto.email, status: true }
      });

      if (!user) {
        throw new Error('Invalid credentials');
      }

      // Verificar la contraseña
      const isPasswordValid = await compare(loginDto.password, user.password);
      if (!isPasswordValid) {
        throw new Error('Invalid credentials');
      }

      // Generar token JWT
      const token = this.generateJwt({
        id: user.id,
        email: user.email,
        role: user.role
      });

      // Eliminar la contraseña del objeto de usuario antes de devolverlo
      const { password, ...userWithoutPassword } = user;

      return {
        user: userWithoutPassword,
        token
      };
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  }

  /**
   * Valida un token JWT
   */
  public validateToken(token: string): JwtPayload | null {
    try {
      return jwt.verify(token, envs.JWT_SECRET) as JwtPayload;
    } catch (error) {
      return null;
    }
  }
}