import { PetPost } from '../../../data/postgres/models/pet-post.model';
import { PostgresDatabase } from '../../../data/postgres/DatabaseSingleton';

export class FinderPetPostService {
  private readonly petPostRepository;

  constructor() {
    
    const postgresDB = PostgresDatabase.getInstance();
    
    this.petPostRepository = postgresDB.getRepository(PetPost);
  }

  async execute(id: string): Promise<PetPost | null> {
    try {
      
      const postgresDB = PostgresDatabase.getInstance();
      await postgresDB.connect();

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
