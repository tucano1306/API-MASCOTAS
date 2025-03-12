// src/presentation/users/services/finder-users.service.ts
import { User, UserRole } from '../../../data/postgres/models/user.model';
import { PostgresDatabase } from '../../../data/postgres/DatabaseSingleton';
import { envs } from '../../../config/envs';
import { Repository } from 'typeorm';

export class FinderUsersService {
  private readonly userRepository: Repository<User>;

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

  async execute(): Promise<User[]> {
    try {
      await this.userRepository.manager.connection.initialize();
      const users = await this.userRepository.find({
        where: { role: UserRole.ADMIN }  // Usar el enum en lugar de un string literal
      });
      return users;
    } catch (error) {
      console.error('Error finding users:', error);
      throw error;
    }
  }
}