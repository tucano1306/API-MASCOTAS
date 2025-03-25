import { hash } from 'bcryptjs';
import jwt, { Secret, SignOptions } from 'jsonwebtoken'; 
import { User, UserRole } from '../../../data/postgres/models/user.model';
import { PostgresDatabase } from '../../../data/postgres/DatabaseSingleton';
import { RegisterUserDto } from '../../../domain/dtos/register-user.dto';
import { Repository } from 'typeorm';
import { envs } from '../../../config/envs';

export class RegisterUserService {
  private readonly userRepository: Repository<User>;

  constructor() {
    const postgresDB = PostgresDatabase.getInstance();
    this.userRepository = postgresDB.getRepository(User);
  }

  async execute(userData: RegisterUserDto): Promise<any> {
    try {
      const postgresDB = PostgresDatabase.getInstance();
      
      if (!postgresDB.dataSourceInstance.isInitialized) {
        await postgresDB.connect();
      }

      
      const existingUser = await this.userRepository.findOne({
        where: { email: userData.email }
      });

      if (existingUser) {
        throw new Error('El email ya está registrado');
      }

      
      const hashedPassword = await hash(userData.password, 10);

      const newUser = this.userRepository.create({
        ...userData,
        password: hashedPassword,
        role: userData.role || UserRole.USER,
        status: true,
      });

      await this.userRepository.save(newUser);
      
      
      const token = jwt.sign(
        { id: newUser.id, email: newUser.email, role: newUser.role },
        envs.JWT_SECRET as Secret,
        { expiresIn: envs.JWT_EXPIRES_IN } as SignOptions
      );

      
      const { password, ...userWithoutPassword } = newUser;
      
      return {
        status: 'success',
        message: 'Usuario registrado exitosamente',
        data: {
          user: userWithoutPassword,
          token
        }
      };
    } catch (error) {
      console.error('Error registrando usuario:', error);
      throw error;
    }
  }
}