import { PetPost } from '../../../data/postgres/models/pet-post.model';
import { PostgresDatabase } from '../../../data/postgres/DatabaseSingleton';
import { envs } from '../../../config/envs';

export class FinderPetPostsService {
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

  async execute(): Promise<PetPost[]> {
    try {
      await this.petPostRepository.manager.connection.initialize();
      const petPosts = await this.petPostRepository.find({
        relations: ['user']
      });
      return petPosts;
    } catch (error) {
      console.error('Error finding pet posts:', error);
      throw error;
    }
  }
}