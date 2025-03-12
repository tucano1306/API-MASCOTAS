import { PetPost } from '../../../data/postgres/models/pet-post.model';
import { PostgresDatabase } from '../../../data/postgres/DatabaseSingleton';

interface UpdatePetPostDTO {
  pet_name?: string;
  description?: string;
  image_url?: string;
  hasFound?: boolean;
}

export class UpdaterPetPostService {
  private readonly petPostRepository;

  constructor() {
    // Se obtiene la instancia única del singleton
    const postgresDB = PostgresDatabase.getInstance();
    // Se obtiene el repositorio de PetPost mediante el método getRepository()
    this.petPostRepository = postgresDB.getRepository(PetPost);
  }

  async execute(id: string, petPostData: UpdatePetPostDTO): Promise<PetPost | null> {
    try {
      // Se asegura de que la conexión a la base de datos esté inicializada
      const postgresDB = PostgresDatabase.getInstance();
      await postgresDB.connect();
      
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
