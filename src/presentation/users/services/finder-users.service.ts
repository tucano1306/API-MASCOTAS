import { User, UserRole } from '../../../data/postgres/models/user.model';
import { DatabaseSingleton } from '../../../data/postgres/DatabaseSingleton';
import { Repository } from 'typeorm';

export class FinderUsersService {
  private readonly userRepository: Repository<User>;

  constructor() {
    // Usar el método estático getInstance() en lugar del constructor
    const db = DatabaseSingleton.getInstance();
    
    // Obtener el repositorio desde la instancia
    this.userRepository = db.dataSourceInstance.getRepository(User);
  }

  async execute(): Promise<User[]> {
    try {
      // No necesitas inicializar la conexión en cada operación si usas el singleton
      const users = await this.userRepository.find({
        where: { role: UserRole.ADMIN }
      });
      return users;
    } catch (error) {
      console.error('Error finding users:', error);
      throw error;
    }
  }
}