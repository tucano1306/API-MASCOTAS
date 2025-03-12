import { DataSource, ObjectLiteral, Repository } from 'typeorm';
import { User } from './models/user.model';
import { PetPost } from './models/pet-post.model';
import { envs } from '../../config/envs';
// src/data/postgres/postgres-database.ts
export { DatabaseSingleton as PostgresDatabase } from './DatabaseSingleton';

/**
 * Singleton para la conexión a la base de datos
 * Esta clase garantiza que solo haya una instancia de conexión 
 * a la base de datos en toda la aplicación
 */
export class DatabaseSingleton {
  private static instance: DatabaseSingleton;
  private dataSource: DataSource;
  private isInitialized: boolean = false;

  private constructor() {
    this.dataSource = new DataSource({
      type: 'postgres',
      host: envs.POSTGRES_HOST,
      port: envs.POSTGRES_PORT,
      username: envs.POSTGRES_USER,
      password: envs.POSTGRES_PASSWORD,
      database: envs.POSTGRES_DB,
      entities: [User, PetPost],
      synchronize: envs.NODE_ENV === 'development', // Solo para desarrollo
      logging: envs.NODE_ENV === 'development',
    });
  }

  /**
   * Obtiene la instancia única del singleton
   */
  public static getInstance(): DatabaseSingleton {
    if (!DatabaseSingleton.instance) {
      DatabaseSingleton.instance = new DatabaseSingleton();
    }
    return DatabaseSingleton.instance;
  }

  /**
   * Inicializa la conexión a la base de datos
   */
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

  /**
   * Obtiene el DataSource de TypeORM (con validación de conexión inicializada)
   */
  public get dataSourceInstance(): DataSource {
    if (!this.isInitialized) {
      throw new Error('Database connection is not initialized. Call connect() first.');
    }
    return this.dataSource;
  }

  /**
   * Obtiene el DataSource sin validación adicional
   */
  public getDataSource(): DataSource {
    return this.dataSource;
  }

  /**
   * Cierra la conexión a la base de datos
   */
  public async close(): Promise<void> {
    if (this.isInitialized && this.dataSource.isInitialized) {
      await this.dataSource.destroy();
      this.isInitialized = false;
      console.log('Database connection closed');
    }
  }

  /**
   * Obtiene un repositorio específico
   */
  public getRepository<T extends ObjectLiteral>(entity: new () => T): Repository<T> {
    if (!this.isInitialized) {
      throw new Error('Database connection is not initialized. Call connect() first.');
    }
    return this.dataSource.getRepository<T>(entity);
  }
}
