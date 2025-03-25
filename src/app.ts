import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { envs } from './config/envs';
import { AppRoutes } from './presentation/routes';
import { RepositoryService } from './data/postgres/repository.service';
import { PostgresDatabase } from './data/postgres/DatabaseSingleton';
import { errorMiddleware } from './presentation/middlewares/error.middleware';
import { notFoundMiddleware } from './presentation/middlewares/not-found.middleware';

export class App {
  private readonly app: express.Application;
  private readonly port: number;
  private readonly db: PostgresDatabase;
  private readonly repositoryService: RepositoryService;

  constructor() {
    this.app = express();
    this.port = envs.PORT;
    this.db = PostgresDatabase.getInstance();
    this.repositoryService = RepositoryService.getInstance();

    this.configureMiddlewares();
    this.configureRoutes();
    this.configureErrorHandlers();
  }

  private configureMiddlewares(): void {
    
    this.app.use(cors());
    
    
    this.app.use(helmet());
    
    
    this.app.use(compression());
    
    
    this.app.use(express.json());
    
    
    this.app.use(express.urlencoded({ extended: true }));
  }

  private configureRoutes(): void {
    
    this.app.use('/api', AppRoutes.routes);
    
    
    this.app.use(notFoundMiddleware);
  }

  private configureErrorHandlers(): void {
  
    this.app.use(errorMiddleware);
  }

  public async start(): Promise<void> {
    try {
      
      await this.db.connect();
      
      
      this.repositoryService.initialize();
      
      
      this.app.listen(this.port, () => {
        console.log(`Servidor corriendo en el puerto ${this.port}`);
        console.log(`Entorno: ${envs.NODE_ENV}`);
      });
    } catch (error) {
      console.error('Error al iniciar la aplicación:', error);
      
      await this.db.close();
      throw error;
    }
  }
}


if (require.main === module) {
  const app = new App();
  app.start()
    .catch(error => {
      console.error('Error crítico al iniciar la aplicación:', error);
      process.exit(1);
    });
}