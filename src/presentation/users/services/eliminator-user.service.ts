import { User } from '../../../data/postgres/models/user.model';
import { PostgresDatabase } from '../../../data/postgres/DatabaseSingleton';

export class EliminatorUserService {
  private readonly userRepository;

  constructor() {
    // Se obtiene la instancia única del singleton
    const postgresDB = PostgresDatabase.getInstance();
    // Se obtiene el repositorio de User mediante el método getRepository()
    this.userRepository = postgresDB.getRepository(User);
  }

  async execute(id: string): Promise<boolean> {
    try {
      // Se asegura de inicializar la conexión a la base de datos
      const postgresDB = PostgresDatabase.getInstance();
      await postgresDB.connect();
      
      const user = await this.userRepository.findOneBy({ id });
      if (!user) return false;
      
      await this.userRepository.remove(user);
      return true;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }
}
