import { compare, hash } from 'bcryptjs';
import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import { User, UserRole } from '../../data/postgres/models/user.model';
import { RepositoryService } from '../../data/postgres/repository.service';
import { DatabaseSingleton } from '../../data/postgres/DatabaseSingleton';
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
    // Obtenemos la instancia del servicio de repositorio
    const repoService = RepositoryService.getInstance();
    
    // Aseguramos que la base de datos esté conectada antes de acceder al repositorio
    const db = DatabaseSingleton.getInstance();
    
    try {
      // Intentamos obtener el repositorio de usuarios
      this.userRepository = repoService.getUserRepository();
    } catch (error) {
      // Si hay un error, verificamos si la base de datos está conectada
      if (!db.dataSourceInstance.isInitialized) {
        console.log('Database connection not initialized. Initializing now...');
        
        // Conectamos sincrónicamente para el constructor
        // Nota: Esto no es ideal en producción, pero resuelve el problema inmediato
        this.initializeDb();
      }
      
      // Después de inicializar, intentamos obtener el repositorio nuevamente
      this.userRepository = repoService.getUserRepository();
    }
  }
  
  // Método privado para inicializar la base de datos
  private async initializeDb() {
    const db = DatabaseSingleton.getInstance();
    
    if (!db.dataSourceInstance.isInitialized) {
      await db.connect();
      
      // Inicializar los repositorios después de conectar
      const repoService = RepositoryService.getInstance();
      repoService.initialize();
    }
  }

  private generateJwt(payload: JwtPayload): string {
    return jwt.sign(
      payload, 
      envs.JWT_SECRET as Secret, 
      { expiresIn: envs.JWT_EXPIRES_IN } as SignOptions
    );
  }

  public async register(registerDto: RegisterUserDto): Promise<{ user: Partial<User>; token: string }> {
    try {
      // Asegurar que la base de datos está conectada
      await this.initializeDb();
      
      const hashedPassword = await hash(registerDto.password, 10);

      const newUser = this.userRepository.create({
        ...registerDto,
        password: hashedPassword,
        role: UserRole.USER 
      });
      
      await this.userRepository.save(newUser);

      const token = this.generateJwt({
        id: newUser.id,
        email: newUser.email,
        role: newUser.role
      });

      const { password, ...userWithoutPassword } = newUser;

      return { user: userWithoutPassword, token };
    } catch (error) {
      console.error('Error registrando el usuario:', error);
      throw new Error('Error al registrar el usuario');
    }
  }

  public async login(loginDto: LoginUserDto): Promise<{ user: Partial<User>; token: string }> {
    try {
      // Asegurar que la base de datos está conectada
      await this.initializeDb();
      
      const user = await this.userRepository.findOne({
        where: { email: loginDto.email, status: true }
      });

      if (!user) {
        throw new Error('Invalid credentials');
      }

      const isPasswordValid = await compare(loginDto.password, user.password);
      if (!isPasswordValid) {
        throw new Error('Invalid credentials');
      }

      const token = this.generateJwt({
        id: user.id,
        email: user.email,
        role: user.role
      });

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

  public validateToken(token: string): JwtPayload | null {
    try {
      return jwt.verify(token, envs.JWT_SECRET) as JwtPayload;
    } catch (error) {
      return null;
    }
  }
}