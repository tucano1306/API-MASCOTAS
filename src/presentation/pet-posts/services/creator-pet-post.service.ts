// src/presentation/pet-posts/services/creator-pet-post.service.ts
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
    // Se obtiene la instancia única del singleton sin pasar argumentos
    const postgresDB = PostgresDatabase.getInstance();
    // Se obtiene el repositorio de PetPost mediante getRepository()
    this.petPostRepository = postgresDB.getRepository(PetPost);
  }

  async execute(petPostData: CreatePetPostDTO): Promise<PetPost> {
    try {
      // Se asegura de que la conexión a la base de datos esté inicializada
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
