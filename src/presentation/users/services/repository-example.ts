import { User } from '../../../data/postgres/models/user.model';
import { RepositoryService } from '../../../data/postgres/repository.service';

/**
 * Ejemplo de servicio que utiliza el RepositoryService centralizado
 */
export class UserService {
  private readonly userRepository;

  constructor() {
    // Obtener el repositorio del servicio centralizado
    const repoService = RepositoryService.getInstance();
    this.userRepository = repoService.getUserRepository();
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async findById(id: string): Promise<User | null> {
    return await this.userRepository.findOne({ where: { id } });
  }

  async create(userData: Partial<User>): Promise<User> {
    const user = this.userRepository.create(userData);
    return await this.userRepository.save(user);
  }

  async update(id: string, userData: Partial<User>): Promise<User | null> {
    const user = await this.findById(id);
    if (!user) return null;

    Object.assign(user, userData);
    return await this.userRepository.save(user);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.userRepository.delete(id);
    return result.affected ? result.affected > 0 : false;
  }
}