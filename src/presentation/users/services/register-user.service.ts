// src/presentation/users/services/register-user.service.ts
import { User, UserRole } from '../../../data/postgres/models/user.model';
import { PostgresDatabase } from '../../../data/postgres/DatabaseSingleton';
import { envs } from '../../../config/envs';
import { RegisterUserDto } from '../../../domain/dtos/register-user.dto';

interface RegisterUserDTO {
  name: string;
  email: string;
  password: string;
}

export class RegisterUserService {
  private readonly userRepository;

  constructor() {
    const postgresDB = new PostgresDatabase({
      host: envs.PGHOST,
      port: envs.PGPORT,
      username: envs.PGUSER,
      password: envs.PGPASSWORD,
      database: envs.PGDATABASE,
    });

    this.userRepository = postgresDB.dataSource.getRepository(User);
  }

  async execute(userData: RegisterUserDTO): Promise<User> {
    try {
      await this.userRepository.manager.connection.initialize();
      
      const newUser = this.userRepository.create({
        ...userData,
        role: UserRole.USER,  // Usa el enum en lugar de una cadena de texto
        status: true
      });
      
      await this.userRepository.save(newUser);
      return newUser;
    } catch (error) {
      console.error('Error registering user:', error);
      throw error;
    }
  }
}