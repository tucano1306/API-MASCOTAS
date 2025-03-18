import { QueryRunner } from 'typeorm';
import { DatabaseSingleton } from './DatabaseSingleton';


export class TransactionService {
  /**
   * Ejecuta múltiples operaciones dentro de una transacción

   * @param operations Función que contiene las operaciones a ejecutar
   * @returns El resultado de las operaciones
   */
  public static async executeTransaction<T>(
    operations: (queryRunner: QueryRunner) => Promise<T>
  ): Promise<T> {
    const db = DatabaseSingleton.getInstance();
    
  
    const dataSource = db.dataSourceInstance;
    
    const queryRunner = dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      
      const result = await operations(queryRunner);
      
      
      await queryRunner.commitTransaction();
      
      return result;
    } catch (error) {
      
      await queryRunner.rollbackTransaction();
      console.error('Transaction failed, rolling back:', error);
      throw error;
    } finally {
      
      await queryRunner.release();
    }
  }
}