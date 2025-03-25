import { compare } from 'bcryptjs';
import jwt, { Secret, SignOptions } from 'jsonwebtoken'; 
import { User } from '../../../data/postgres/models/user.model';
import { PostgresDatabase } from '../../../data/postgres/DatabaseSingleton';
import { envs } from '../../../config/envs';
import { LoginUserDto } from '../../../domain/dtos/login-user.dto';

export class LoginUserService {
  private readonly userRepository;

  constructor() {
    const postgresDB = PostgresDatabase.getInstance();
    this.userRepository = postgresDB.getRepository(User);
  }

  async execute(loginDto: LoginUserDto) {
    try {
      
      const postgresDB = PostgresDatabase.getInstance();
      if (!postgresDB.dataSourceInstance.isInitialized) {
        await postgresDB.connect();
      }

      
      const user = await this.userRepository.findOne({
        where: { email: loginDto.email, status: true }
      });

      if (!user) {
        throw new Error('Email o contraseña incorrectos');
      }

      
      const isPasswordValid = await compare(loginDto.password, user.password);
      if (!isPasswordValid) {
        throw new Error('Email o contraseña incorrectos');
      }

      
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        envs.JWT_SECRET as Secret, 
        { expiresIn: envs.JWT_EXPIRES_IN } as SignOptions
      );

      
      const { password, ...userWithoutPassword } = user;

      return {
        status: 'success',
        message: 'Login exitoso',
        data: {
          user: userWithoutPassword,
          token
        }
      };
    } catch (error) {
      console.error('Error en login:', error);
      throw error;
    }
  }
}