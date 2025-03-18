
import { PetPost } from '../../../data/postgres/models/pet-post.model';
import { PostgresDatabase } from '../../../data/postgres/DatabaseSingleton';

export class EliminatorPetPostService {
  private readonly petPostRepository;

  constructor() {
    
    const postgresDB = PostgresDatabase.getInstance();
    this.petPostRepository = postgresDB.getRepository(PetPost);
  }

  async execute(id: string): Promise<boolean> {
    try {
      
      const postgresDB = PostgresDatabase.getInstance();
      await postgresDB.connect();
      
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
