import { PetPost, PetPostStatus } from '../../../data/postgres/models/pet-post.model';
import { PostgresDatabase } from '../../../data/postgres/DatabaseSingleton';

interface CreatePetPostDTO {
  pet_name: string;
  description: string;
  image_url?: string;
  user_id: string;
}

export class CreatorPetPostService {
  private readonly petPostRepository;

  constructor() {
  
    const postgresDB = PostgresDatabase.getInstance();
    
    this.petPostRepository = postgresDB.getRepository(PetPost);
  }

  async execute(petPostData: CreatePetPostDTO): Promise<PetPost> {
    try {
      
      const postgresDB = PostgresDatabase.getInstance();
      await postgresDB.connect();

      const newPetPost = this.petPostRepository.create({
        ...petPostData,
        status: PetPostStatus.PENDING,
        hasFound: false,
      });

      await this.petPostRepository.save(newPetPost);
      return newPetPost;
    } catch (error) {
      console.error('Error creating pet post:', error);
      throw error;
    }
  }
}
