import { DataSource } from 'typeorm';
import { envs } from '../../config/envs';
import { User } from './models/user.model';
import { PetPost } from './models/pet-post.model';


export const AppDataSource = new DataSource({
  type: 'postgres',
  host: envs.POSTGRES_HOST,
  port: envs.POSTGRES_PORT,
  username: envs.POSTGRES_USER,
  password: envs.POSTGRES_PASSWORD,
  database: envs.POSTGRES_DB,
  entities: [User, PetPost],
  synchronize: false, 
  logging: envs.NODE_ENV === 'development',
  migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
  migrationsTableName: 'migrations_history',
});