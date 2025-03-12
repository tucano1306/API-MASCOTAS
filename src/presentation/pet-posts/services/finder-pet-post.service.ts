import { PetPost } from '../../../data/postgres/models/pet-post.model';
import { PostgresDatabase } from '../../../data/postgres/DatabaseSingleton';

export class FinderPetPostService {
  private readonly petPostRepository;

  constructor() {
    // Se obtiene la instancia única del singleton
    const postgresDB = PostgresDatabase.getInstance();
    // Se obtiene el repositorio para PetPost mediante getRepository()
    this.petPostRepository = postgresDB.getRepository(PetPost);
  }

  async execute(id: string): Promise<PetPost | null> {
    try {
      // Se asegura de inicializar la conexión si aún no está establecida
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
