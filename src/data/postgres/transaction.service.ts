import { QueryRunner } from 'typeorm';
import { DatabaseSingleton } from './DatabaseSingleton';

/**
 * Servicio para gestionar transacciones en la base de datos
 * Permite ejecutar múltiples operaciones como una unidad atómica
 */
export class TransactionService {
  /**
   * Ejecuta múltiples operaciones dentro de una transacción
   * Si alguna operación falla, se revierten todos los cambios
   * 
   * @param operations Función que contiene las operaciones a ejecutar
   * @returns El resultado de las operaciones
   */
  public static async executeTransaction<T>(
    operations: (queryRunner: QueryRunner) => Promise<T>
  ): Promise<T> {
    const db = DatabaseSingleton.getInstance();
    
    // Aquí vamos a usar dataSourceInstance en lugar de getDataSource
    // Asumiendo que tu clase tiene un getter llamado dataSourceInstance
    const dataSource = db.dataSourceInstance;
    
    const queryRunner = dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Ejecutar todas las operaciones dentro de la transacción
      const result = await operations(queryRunner);
      
      // Confirmar la transacción
      await queryRunner.commitTransaction();
      
      return result;
    } catch (error) {
      // Si hay un error, revertir todos los cambios
      await queryRunner.rollbackTransaction();
      console.error('Transaction failed, rolling back:', error);
      throw error;
    } finally {
      // Liberar el queryRunner en cualquier caso
      await queryRunner.release();
    }
  }
}