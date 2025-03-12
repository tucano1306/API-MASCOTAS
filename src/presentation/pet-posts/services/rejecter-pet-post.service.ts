import { PetPost, PetPostStatus } from '../../../data/postgres/models/pet-post.model';
import { PostgresDatabase } from '../../../data/postgres/DatabaseSingleton';
import { envs } from '../../../config/envs';

export class RejecterPetPostService {
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
      
      const petPost = await this.petPostRepository.findOneBy({ id });
      if (!petPost) return null;
      
      petPost.status = PetPostStatus.REJECTED;
      await this.petPostRepository.save(petPost);
      
      return petPost;
    } catch (error) {
      console.error('Error rejecting pet post:', error);
      throw error;
    }
  }
}