import { PetPost } from '../../../data/postgres/models/pet-post.model';
import { PostgresDatabase } from '../../../data/postgres/DatabaseSingleton';

export class FinderPetPostsService {
  private readonly petPostRepository;

  constructor() {
    
    const postgresDB = PostgresDatabase.getInstance();
    
    this.petPostRepository = postgresDB.getRepository(PetPost);
  }

  async execute(): Promise<PetPost[]> {
    try {
      
      await PostgresDatabase.getInstance().connect();

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
