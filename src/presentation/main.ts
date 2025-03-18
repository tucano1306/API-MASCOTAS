import { App } from '../app';
import { envs } from '../config/envs';

(async () => {
  try {
    const app = new App();
    await app.start();
  } catch (error) {
    console.error('Error starting application:', error);
    process.exit(1);
  }
})();