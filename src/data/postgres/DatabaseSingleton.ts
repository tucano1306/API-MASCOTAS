// src/data/postgres/DatabaseSingleton.ts
import { DataSource, ObjectLiteral, Repository } from 'typeorm';
import { User } from './models/user.model';
import { PetPost } from './models/pet-post.model';
import { envs } from '../../config/envs';
export { DatabaseSingleton as PostgresDatabase } from './DatabaseSingleton';

export class DatabaseSingleton {
  private static instance: DatabaseSingleton;
  private dataSource: DataSource;
  private isInitialized: boolean = false;
  private connectionPromise: Promise<void> | null = null;

  private constructor() {
    this.dataSource = new DataSource({
      type: 'postgres',
      url: envs.POSTGRES_URL, 
      host: envs.POSTGRES_HOST,
      port: envs.POSTGRES_PORT,
      username: envs.POSTGRES_USER,
      password: envs.POSTGRES_PASSWORD,
      database: envs.POSTGRES_DB,
      entities: [User, PetPost],
      synchronize: envs.NODE_ENV === 'development',
      logging: envs.NODE_ENV === 'development',
      ssl: envs.NODE_ENV === 'production' // Solo usar SSL en producción
    });
  }

  public static getInstance(): DatabaseSingleton {
    if (!DatabaseSingleton.instance) {
      DatabaseSingleton.instance = new DatabaseSingleton();
    }
    return DatabaseSingleton.instance;
  }

  public connect(): Promise<void> {
    if (this.isInitialized) {
      return Promise.resolve();
    }
    
    if (this.connectionPromise) {
      return this.connectionPromise;
    }
    
    this.connectionPromise = this.initializeConnection();
    return this.connectionPromise;
  }
  
  private async initializeConnection(): Promise<void> {
    try {
      console.log('Intentando inicializar la conexión a la base de datos...');
      await this.dataSource.initialize();
      console.log('Conexión a la base de datos inicializada correctamente');
      this.isInitialized = true;
    } catch (error) {
      console.error('Error al inicializar la conexión a la base de datos:', error);
      this.connectionPromise = null;
      throw error;
    }
  }

  public get dataSourceInstance(): DataSource {
    if (!this.isInitialized) {
      throw new Error('Database connection is not initialized. Call connect() first.');
    }
    return this.dataSource;
  }

  public getDataSource(): DataSource {
    if (!this.isInitialized) {
      throw new Error('Database connection is not initialized. Call connect() first.');
    }
    return this.dataSource;
  }

  public async close(): Promise<void> {
    if (this.isInitialized && this.dataSource.isInitialized) {
      await this.dataSource.destroy();
      this.isInitialized = false;
      this.connectionPromise = null;
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