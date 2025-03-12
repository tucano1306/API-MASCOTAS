// src/presentation/users/services/finder-user.service.ts
import { User } from '../../../data/postgres/models/user.model';
import { PostgresDatabase } from '../../../data/postgres/DatabaseSingleton';
import { envs } from '../../../config/envs';

export class FinderUserService {
  private readonly userRepository;

  constructor() {
    const postgresDB = DatabaseSingleton({
      host: envs.POSTGRES_HOST,
      port: envs.POSTGRES_PORT,
      username: envs.POSTGRES_USER,
      password: envs.POSTGRES_PASSWORD,
      database: envs.POSTGRES_DB,
    });

    this.userRepository = postgresDB.dataSourceInstance.getRepository(User);
  }

  async execute(id: string): Promise<User | null> {
    try {
      await this.userRepository.manager.connection.initialize();
      const user = await this.userRepository.findOneBy({ id });
      return user;
    } catch (error) {
      console.error('Error finding user:', error);
      throw error;
    }
  }
}