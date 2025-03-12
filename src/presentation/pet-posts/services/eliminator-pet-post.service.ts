import { PetPost } from '../../../data/postgres/models/pet-post.model';
import { PostgresDatabase } from '../../../data/postgres/DatabaseSingleton';
import { envs } from '../../../config/envs';

export class EliminatorPetPostService {
  private readonly petPostRepository;

  constructor() {
    const postgresDB = new PostgresDatabase({
      host: envs.PGHOST,
      port: envs.PGPORT,
      username: envs.PGUSER,
      password: envs.PGPASSWORD,
      database: envs.PGDATABASE,
    });

    this.petPostRepository = postgresDB.dataSource.getRepository(PetPost);
  }

  async execute(id: string): Promise<boolean> {
    try {
      await this.petPostRepository.manager.connection.initialize();
      
      const petPost = await this.petPostRepository.findOneBy({ id });
      if (!petPost) return false;
      
      await this.petPostRepository.remove(petPost);
      return true;
    } catch (error) {
      console.error('Error deleting pet post:', error);
      throw error;
    }
  }
}