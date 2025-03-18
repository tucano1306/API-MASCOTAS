import { User } from '../../../data/postgres/models/user.model';
import { PostgresDatabase } from '../../../data/postgres/DatabaseSingleton';
import { envs } from '../../../config/envs';

interface UpdateUserDTO {
  name?: string;
  email?: string;
  password?: string;
  status?: boolean;
}

export class UpdaterUserService {
  private readonly userRepository;

  constructor() {
    
    const postgresDB = PostgresDatabase.getInstance();
    
    this.userRepository = postgresDB.getRepository(User);
  }

  async execute(id: string, userData: UpdateUserDTO): Promise<User | null> {
    try {
      
      const postgresDB = PostgresDatabase.getInstance();
      await postgresDB.connect();
      
      const user = await this.userRepository.findOneBy({ id });
      if (!user) return null;
      
      Object.assign(user, userData);
      await this.userRepository.save(user);
      
      return user;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }
}
