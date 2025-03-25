// src/test-db-connection.ts
import { PostgresDatabase } from './data/postgres/DatabaseSingleton';

async function testConnection() {
  try {
    const db = PostgresDatabase.getInstance();
    console.log('Intentando conectar a la base de datos...');
    await db.connect();
    console.log('Conexión exitosa a la base de datos');
    await db.close();
    console.log('Conexión cerrada');
  } catch (error) {
    console.error('Error al conectar a la base de datos:', error);
  }
}

testConnection();