// src/presentation/pet-posts/services/creator-pet-post.service.ts
import { PetPost, PetPostStatus } from '../../../data/postgres/models/pet-post.model';
import { PostgresDatabase } from '../../../data/postgres/DatabaseSingleton';
import { envs } from '../../../config/envs';

interface CreatePetPostDTO {
  pet_name: string;
  description: string;
  image_url?: string;
  user_id: string;
}

export class CreatorPetPostService {
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

  async execute(petPostData: CreatePetPostDTO): Promise<PetPost> {
    try {
      await this.petPostRepository.manager.connection.initialize();
      
      const newPetPost = this.petPostRepository.create({
        ...petPostData,
        status: PetPostStatus.PENDING,
        hasFound: false
      });
      
      await this.petPostRepository.save(newPetPost);
      return newPetPost;
    } catch (error) {
      console.error('Error creating pet post:', error);
      throw error;
    }
  }
}