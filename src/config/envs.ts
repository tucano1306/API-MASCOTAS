import 'dotenv/config';
import * as env from 'env-var';

export const envs = {
  
  PORT: env.get('PORT').default(3000).asPortNumber(),
  NODE_ENV: env.get('NODE_ENV').default('development').asString(),

  
  POSTGRES_URL: env.get('POSTGRES_URL').default('').asString(),
  POSTGRES_DB: env.get('POSTGRES_DB').required().asString(),
  POSTGRES_USER: env.get('POSTGRES_USER').required().asString(),
  POSTGRES_PASSWORD: env.get('POSTGRES_PASSWORD').required().asString(),
  POSTGRES_PORT: env.get('POSTGRES_PORT').default(5432).asPortNumber(),
  POSTGRES_HOST: env.get('POSTGRES_HOST').required().asString(),

  
  JWT_SECRET: env.get('JWT_SECRET').default('tu_clave_secreta_jwt').asString(),
  JWT_EXPIRES_IN: env.get('JWT_EXPIRES_IN').default('1d').asString(),
};