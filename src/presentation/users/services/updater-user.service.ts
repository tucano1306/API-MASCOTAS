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
    const postgresDB = new PostgresDatabase({
      host: envs.PGHOST,
      port: envs.PGPORT,
      username: envs.PGUSER,
      password: envs.PGPASSWORD,
      database: envs.PGDATABASE,
    });

    this.userRepository = postgresDB.dataSource.getRepository(User);
  }

  async execute(id: string, userData: UpdateUserDTO): Promise<User | null> {
    try {
      await this.userRepository.manager.connection.initialize();
      
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