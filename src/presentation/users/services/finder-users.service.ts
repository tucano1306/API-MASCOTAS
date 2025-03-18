import { User, UserRole } from '../../../data/postgres/models/user.model';
import { DatabaseSingleton } from '../../../data/postgres/DatabaseSingleton';
import { Repository } from 'typeorm';

export class FinderUsersService {
  private readonly userRepository: Repository<User>;

  constructor() {
  
    const db = DatabaseSingleton.getInstance();
    

    this.userRepository = db.dataSourceInstance.getRepository(User);
  }

  async execute(): Promise<User[]> {
    try {
      
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