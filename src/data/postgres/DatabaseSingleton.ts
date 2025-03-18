import { DataSource, ObjectLiteral, Repository } from 'typeorm';
import { User } from './models/user.model';
import { PetPost } from './models/pet-post.model';
import { envs } from '../../config/envs';
export { DatabaseSingleton as PostgresDatabase } from './DatabaseSingleton';

export class DatabaseSingleton {
  private static instance: DatabaseSingleton;
  private dataSource: DataSource;
  private isInitialized: boolean = false;

  private constructor() {
    this.dataSource = new DataSource({
      type: 'postgres',
      url: envs.POSTGRES_URL, 
      entities: [User, PetPost],
      synchronize: envs.NODE_ENV === 'development',
      logging: envs.NODE_ENV === 'development',
      ssl: true
    });
  }

  
  public static getInstance(): DatabaseSingleton {
    if (!DatabaseSingleton.instance) {
      DatabaseSingleton.instance = new DatabaseSingleton();
    }
    return DatabaseSingleton.instance;
  }

  
  public async connect(): Promise<void> {
    if (!this.isInitialized) {
      try {
        await this.dataSource.initialize();
        console.log('Database connection initialized successfully');
        this.isInitialized = true;
      } catch (error) {
        console.error('Error initializing database connection:', error);
        throw error;
      }
    }
  }

  
   
   
  public get dataSourceInstance(): DataSource {
    if (!this.isInitialized) {
      throw new Error('Database connection is not initialized. Call connect() first.');
    }
    return this.dataSource;
  }

  
  public getDataSource(): DataSource {
    return this.dataSource;
  }

  
  public async close(): Promise<void> {
    if (this.isInitialized && this.dataSource.isInitialized) {
      await this.dataSource.destroy();
      this.isInitialized = false;
      console.log('Database connection closed');
    }
  }

  
  public getRepository<T extends ObjectLiteral>(entity: new () => T): Repository<T> {
    if (!this.isInitialized) {
      throw new Error('Database connection is not initialized. Call connect() first.');
    }
    return this.dataSource.getRepository<T>(entity);
  }
}
