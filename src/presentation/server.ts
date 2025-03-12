import express, { Router } from 'express';

interface ServerOptions {
  port: number;
  routes: Router;
}

export class Server {
  private app: express.Application;
  private readonly port: number;
  private readonly routes: Router;

  constructor(options: ServerOptions) {
    this.app = express();
    this.port = options.port;
    this.routes = options.routes;
    
    this.configureRoutes();
  }

  private configureRoutes(): void {
    this.app.use(this.routes);
  }

  public async start(): Promise<void> {
    return new Promise((resolve) => {
      this.app.listen(this.port, () => {
        console.log(`Server running on port ${this.port}`);
        resolve();
      });
    });
  }

  public getApp(): express.Application {
    return this.app;
  }
}