// src/presentation/users/services/register-user.service.ts
import { User, UserRole } from '../../../data/postgres/models/user.model';
import { PostgresDatabase } from '../../../data/postgres/DatabaseSingleton';
import { RegisterUserDto } from '../../../domain/dtos/register-user.dto';

export class RegisterUserService {
  private readonly userRepository;

  constructor() {
    const postgresDB = PostgresDatabase.getInstance();
    // Debido a que 'dataSource' es privada y no existe un método público para acceder a ella,
    // se utiliza un cast a 'any'. Se recomienda agregar un método en 'PostgresDatabase' que retorne el dataSource.
    this.userRepository = (postgresDB as any).dataSource.getRepository(User);
  }

  async execute(userData: RegisterUserDto): Promise<User> {
    try {
      // Inicializa la conexión si aún no está establecida
      await this.userRepository.manager.connection.initialize();

      const newUser = this.userRepository.create({
        ...userData,
        role: UserRole.USER, // Usa el enum en lugar de una cadena de texto
        status: true,
      });

      await this.userRepository.save(newUser);
      return newUser;
    } catch (error) {
      console.error('Error registering user:', error);
      throw error;
    }
  }
}
