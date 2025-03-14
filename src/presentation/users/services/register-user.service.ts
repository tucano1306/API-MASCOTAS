import { User, UserRole } from '../../../data/postgres/models/user.model';
import { PostgresDatabase } from '../../../data/postgres/DatabaseSingleton';
import { RegisterUserDto } from '../../../domain/dtos/register-user.dto';
import { Repository } from 'typeorm';

export class RegisterUserService {
  private readonly userRepository: Repository<User>;

  constructor() {
    const postgresDB = PostgresDatabase.getInstance();
    // Use dataSourceInstance to get the repository
    this.userRepository = postgresDB.dataSourceInstance.getRepository(User);
  }

  async execute(userData: RegisterUserDto): Promise<User> {
    try {
      // Ensure the database connection is established
      const postgresDB = PostgresDatabase.getInstance();
      
      // If not already connected, connect
      if (!postgresDB.dataSourceInstance.isInitialized) {
        await postgresDB.connect();
      }

      const newUser = this.userRepository.create({
        ...userData,
        role: UserRole.USER,
        status: true,
      });

      await this.userRepository.save(newUser);
      return newUser;
    } catch (error) {
      console.error('Error registering user:', error);
      throw error;
    }
  }
}