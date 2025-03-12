import { User, UserRole } from '../../../data/postgres/models/user.model';
import { DatabaseSingleton } from '../../../data/postgres/DatabaseSingleton';
import { Repository } from 'typeorm';

export class FinderUserService {
  private readonly userRepository: Repository<User>;

  constructor() {
    // Usar el método estático getInstance() en lugar del constructor
    const db = DatabaseSingleton.getInstance();
    
    // Obtener el repositorio desde la instancia
    this.userRepository = db.dataSourceInstance.getRepository(User);
  }

  async execute(id: string): Promise<User | null> {
    try {
      const user = await this.userRepository.findOneBy({ id });
      return user;
    } catch (error) {
      console.error('Error finding user:', error);
      throw error;
    }
  }
}