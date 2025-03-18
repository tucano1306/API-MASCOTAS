import { Repository } from 'typeorm';
import { DatabaseSingleton } from './DatabaseSingleton';
import { User } from './models/user.model';
import { PetPost } from './models/pet-post.model';

export class RepositoryService {
  private static instance: RepositoryService;
  private db: DatabaseSingleton;
  
  
  private userRepository: Repository<User> | null = null;
  private petPostRepository: Repository<PetPost> | null = null;

  private constructor() {
    this.db = DatabaseSingleton.getInstance();
  }

  
  public static getInstance(): RepositoryService {
    if (!RepositoryService.instance) {
      RepositoryService.instance = new RepositoryService();
    }
    return RepositoryService.instance;
  }

  
  public initialize(): void {
    try {
      
      const dataSource = this.db.dataSourceInstance;
      this.userRepository = dataSource.getRepository(User);
      this.petPostRepository = dataSource.getRepository(PetPost);
      console.log('All repositories initialized successfully');
    } catch (error) {
      console.error('Error initializing repositories:', error);
      throw error;
    }
  }

  
  public getUserRepository(): Repository<User> {
    if (!this.userRepository) {
      throw new Error('User repository not initialized');
    }
    return this.userRepository;
  }

  
  public getPetPostRepository(): Repository<PetPost> {
    if (!this.petPostRepository) {
      throw new Error('PetPost repository not initialized');
    }
    return this.petPostRepository;
  }
}