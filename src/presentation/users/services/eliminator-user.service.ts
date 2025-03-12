import { User } from '../../../data/postgres/models/user.model';
import { PostgresDatabase } from '../../../data/postgres/DatabaseSingleton';
import { envs } from '../../../config/envs';

export class EliminatorUserService {
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

  async execute(id: string): Promise<boolean> {
    try {
      await this.userRepository.manager.connection.initialize();
      
      const user = await this.userRepository.findOneBy({ id });
      if (!user) return false;
      
      await this.userRepository.remove(user);
      return true;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }
}