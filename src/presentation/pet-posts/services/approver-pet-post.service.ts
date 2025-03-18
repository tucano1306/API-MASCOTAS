import { PetPost, PetPostStatus } from '../../../data/postgres/models/pet-post.model';
import { PostgresDatabase } from '../../../data/postgres/DatabaseSingleton';

export class ApproverPetPostService {
  private readonly petPostRepository;

  constructor() {
    
    const postgresDB = PostgresDatabase.getInstance();
    
    this.petPostRepository = postgresDB.getRepository(PetPost);
  }

  async execute(id: string): Promise<PetPost | null> {
    try {
      
      const postgresDB = PostgresDatabase.getInstance();
      await postgresDB.connect();

      const petPost = await this.petPostRepository.findOneBy({ id });
      if (!petPost) return null;

      petPost.status = PetPostStatus.APPROVED;
      await this.petPostRepository.save(petPost);

      return petPost;
    } catch (error) {
      console.error('Error approving pet post:', error);
      throw error;
    }
  }
}
