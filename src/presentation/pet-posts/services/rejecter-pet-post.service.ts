import { PetPost, PetPostStatus } from '../../../data/postgres/models/pet-post.model';
import { PostgresDatabase } from '../../../data/postgres/DatabaseSingleton';

export class RejecterPetPostService {
  private readonly petPostRepository;

  constructor() {
    // Se obtiene la instancia única del singleton y se utiliza getRepository() para obtener el repositorio de PetPost
    const postgresDB = PostgresDatabase.getInstance();
    this.petPostRepository = postgresDB.getRepository(PetPost);
  }

  async execute(id: string): Promise<PetPost | null> {
    try {
      // Se asegura de inicializar la conexión a la base de datos
      const postgresDB = PostgresDatabase.getInstance();
      await postgresDB.connect();

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
