import 'reflect-metadata';
import { envs } from './config/envs';
import { DatabaseSingleton } from './data/postgres/DatabaseSingleton';
import { AppRoutes } from './presentation/routes';
import { Server } from './presentation/server';
import { errorMiddleware, notFoundMiddleware } from './presentation/middlewares';
import express from 'express';
import cors from 'cors';
import helmet from 'compression';


export class App {
  public app: express.Application;
  private server: Server;

  constructor() {
    this.app = express();
    this.server = new Server({
      port: envs.PORT,
      routes: AppRoutes.routes,
    });
    this.config();
  }

  private config(): void {
    // Middlewares de seguridad y utilidad
    this.app.use(cors());
    this.app.use(helmet());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));

    // Rutas de la API
    this.app.use('/api', AppRoutes.routes);

    // Middleware para manejar rutas no encontradas
    this.app.use('*', notFoundMiddleware);

    // Middleware para manejar errores
    this.app.use(errorMiddleware);
  }

  public async start(): Promise<void> {
    try {
      // Inicializar la base de datos usando el singleton
      const db = DatabaseSingleton.getInstance();
      
      // Conectar a la base de datos
      await db.connect();
      console.log('Database connected successfully');

      // Inicializar el servidor
      await this.server.start();
      console.log(`Server running on port ${envs.PORT}`);
    } catch (error) {
      console.error('Error starting the application:', error);
      throw error;
    }
  }
}

async function main() {
  try {
    // Inicializar la aplicación
    const app = new App();
    
    // Iniciar la aplicación
    await app.start();
  } catch (error) {
    console.error('Cannot start the application:', error);
    process.exit(1);
  }
}

// Ejecutar la aplicación
main();