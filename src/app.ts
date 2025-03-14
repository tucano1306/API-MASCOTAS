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
    // Configuración de middlewares básicos
    this.app.use(cors());
    this.app.use(helmet());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  public async start(): Promise<void> {
    try {
      // Primero, conectamos a la base de datos
      const db = DatabaseSingleton.getInstance();
      await db.connect();
      console.log('Database connected successfully');

      // Luego, importamos dinámicamente las rutas, de modo que los servicios
      // que se instancien en ellas ya encuentren la conexión activa
      const { AppRoutes } = await import('./presentation/routes');

      // Configuramos las rutas de la API y los middlewares de error
      this.app.use('/api', AppRoutes.routes);
      this.app.use('*', notFoundMiddleware);
      this.app.use(errorMiddleware);

      // Iniciamos el servidor
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
