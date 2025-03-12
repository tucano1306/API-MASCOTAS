import { PetPost } from '../../../data/postgres/models/pet-post.model';
import { PostgresDatabase } from '../../../data/postgres/DatabaseSingleton';
import { envs } from '../../../config/envs';

export class FinderPetPostService {
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

  async execute(id: string): Promise<PetPost | null> {
    try {
      await this.petPostRepository.manager.connection.initialize();
      const petPost = await this.petPostRepository.findOne({
        where: { id },
        relations: ['user']
      });
      return petPost;
    } catch (error) {
      console.error('Error finding pet post:', error);
      throw error;
    }
  }
}