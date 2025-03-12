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
   * Registra un nuevo usuario
   */
  public async register(registerDto: RegisterUserDto): Promise<User> {
    try {
      // Verificar si el usuario ya existe
      const existingUser = await this.userRepository.findOne({
        where: { email: registerDto.email }
      });

      if (existingUser) {
        throw new Error('User already exists');
      }

      // Encriptar la contraseña
      const hashedPassword = await hash(registerDto.password, 10);

      // Crear el nuevo usuario
      const newUser = this.userRepository.create({
        ...registerDto,
        password: hashedPassword,
        role: UserRole.USER,
        status: true
      });

      // Guardar el usuario en la base de datos
      return await this.userRepository.save(newUser);
    } catch (error) {
      console.error('Error registering user:', error);
      throw error;
    }
  }

  /**
   * Inicia sesión con un usuario existente
   */
  public async login(loginDto: LoginUserDto): Promise<{ user: User; token: string }> {
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
        // @ts-ignore: Ignorar el error de tipo aquí
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

  /**
   * Genera un token JWT
   */
 /**
 * Genera un token JWT
 */
 private generateJwt(payload: JwtPayload): string {
    return jwt.sign(
      payload, 
      envs.JWT_SECRET as any,
      {
        // Usar 'as any' para evitar problemas de tipado
        expiresIn: envs.JWT_EXPIRES_IN as any
      }
    );
  }
}