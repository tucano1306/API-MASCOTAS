import { PetPost } from '../../../data/postgres/models/pet-post.model';
import { PostgresDatabase } from '../../../data/postgres/DatabaseSingleton';
import { envs } from '../../../config/envs';

interface UpdatePetPostDTO {
  pet_name?: string;
  description?: string;
  image_url?: string;
  hasFound?: boolean;
}

export class UpdaterPetPostService {
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

  async execute(id: string, petPostData: UpdatePetPostDTO): Promise<PetPost | null> {
    try {
      await this.petPostRepository.manager.connection.initialize();
      
      const petPost = await this.petPostRepository.findOneBy({ id });
      if (!petPost) return null;
      
      Object.assign(petPost, petPostData);
      await this.petPostRepository.save(petPost);
      
      return petPost;
    } catch (error) {
      console.error('Error updating pet post:', error);
      throw error;
    }
  }
}