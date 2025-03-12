import { PetPost } from '../../../data/postgres/models/pet-post.model';
import { PostgresDatabase } from '../../../data/postgres/DatabaseSingleton';

export class FinderPetPostsService {
  private readonly petPostRepository;

  constructor() {
    // Se obtiene la instancia única del singleton
    const postgresDB = PostgresDatabase.getInstance();
    // Se obtiene el repositorio de PetPost mediante el método getRepository
    this.petPostRepository = postgresDB.getRepository(PetPost);
  }

  async execute(): Promise<PetPost[]> {
    try {
      // Se asegura de que la conexión esté inicializada
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
