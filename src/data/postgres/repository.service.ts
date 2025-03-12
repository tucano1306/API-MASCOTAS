import { Repository } from 'typeorm';
import { DatabaseSingleton } from './DatabaseSingleton';
import { User } from './models/user.model';
import { PetPost } from './models/pet-post.model';

/**
 * Servicio centralizado para acceder a los repositorios
 * Evita la creación de múltiples instancias de repositorios en los servicios
 */
export class RepositoryService {
  private static instance: RepositoryService;
  private db: DatabaseSingleton;
  
  // Repositorios
  private userRepository: Repository<User> | null = null;
  private petPostRepository: Repository<PetPost> | null = null;

  private constructor() {
    this.db = DatabaseSingleton.getInstance();
  }

  /**
   * Obtiene la instancia única del servicio de repositorios
   */
  public static getInstance(): RepositoryService {
    if (!RepositoryService.instance) {
      RepositoryService.instance = new RepositoryService();
    }
    return RepositoryService.instance;
  }

  /**
   * Inicializa todos los repositorios
   * Debe llamarse después de inicializar la conexión a la base de datos
   */
  public initialize(): void {
    try {
      // Aquí está el cambio clave: usar dataSourceInstance en lugar de getDataSource()
      const dataSource = this.db.dataSourceInstance;
      this.userRepository = dataSource.getRepository(User);
      this.petPostRepository = dataSource.getRepository(PetPost);
      console.log('All repositories initialized successfully');
    } catch (error) {
      console.error('Error initializing repositories:', error);
      throw error;
    }
  }

  /**
   * Obtiene el repositorio de usuarios
   */
  public getUserRepository(): Repository<User> {
    if (!this.userRepository) {
      throw new Error('User repository not initialized');
    }
    return this.userRepository;
  }

  /**
   * Obtiene el repositorio de publicaciones de mascotas
   */
  public getPetPostRepository(): Repository<PetPost> {
    if (!this.petPostRepository) {
      throw new Error('PetPost repository not initialized');
    }
    return this.petPostRepository;
  }
}