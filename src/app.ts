import 'reflect-metadata';
import { envs } from './config/envs';
import { DatabaseSingleton } from './data/postgres/DatabaseSingleton';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { errorMiddleware, notFoundMiddleware } from './presentation/middlewares';

export class App {
  public app: express.Application;

  constructor() {
    this.app = express();
    this.config();
  }

  private config(): void {
    
    this.app.use(cors());
    this.app.use(helmet());
    this.app.use(express.json());
    this.app.options('*', cors());
    this.app.use(express.urlencoded({ extended: true }));
  }

  public async start(): Promise<void> {
    try {
      
      const db = DatabaseSingleton.getInstance();
      await db.connect();
      console.log('Database connected successfully');

      
      const { AppRoutes } = await import('./presentation/routes');

      
      this.app.use('/api', AppRoutes.routes);
      this.app.use('*', notFoundMiddleware);
      this.app.use(errorMiddleware);

      
      this.app.listen(envs.PORT, () => {
        console.log(`Server running on port ${envs.PORT}`);
      });
    } catch (error) {
      console.error('Error starting the application:', error);
      throw error;
    }
  }
}

async function main() {
  try {
    const appInstance = new App();
    await appInstance.start();
  } catch (error) {
    console.error('Cannot start the application:', error);
    process.exit(1);
  }
}

main();
