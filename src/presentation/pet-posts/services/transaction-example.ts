import { PetPost, PetPostStatus } from '../../../data/postgres/models/pet-post.model';
import { User } from '../../../data/postgres/models/user.model';
import { TransactionService } from '../../../data/postgres/transaction.service';

/**
 * Ejemplo de uso del servicio de transacciones
 * Esta es una operación compleja que debe ejecutarse como una unidad atómica
 */
export const approvePostAndNotifyUser = async (postId: string, adminComment: string): Promise<PetPost> => {
  return await TransactionService.executeTransaction(async (queryRunner) => {
    // Obtener repositorios dentro de la transacción
    const petPostRepo = queryRunner.manager.getRepository(PetPost);
    const userRepo = queryRunner.manager.getRepository(User);

    // Buscar la publicación
    const petPost = await petPostRepo.findOne({ 
      where: { id: postId },
      relations: ['user']
    });

    if (!petPost) {
      throw new Error('Pet post not found');
    }

    // Actualizar el estado de la publicación
    petPost.status = PetPostStatus.APPROVED;
    
    // La propiedad adminComment no existe en el modelo PetPost
    // Podemos usar la propiedad description o agregar el comentario a otra propiedad existente
    petPost.description += `\n\nAdmin comment: ${adminComment}`;
    
    await petPostRepo.save(petPost);

    // Actualizar estadísticas del usuario (modifica esto según tu modelo User)
    const user = petPost.user;
    
    // Como no existe approvedPostsCount, podríamos actualizar otra propiedad
    // O simplemente registrar la actividad sin actualizar el contador
    
    await userRepo.save(user);

    // Registrar la actividad (podría ser otra tabla)
    // Podemos comentar o eliminar esta parte si no existe la tabla activity_log
    /*
    await queryRunner.query(`
      INSERT INTO activity_log (user_id, action, entity_id, created_at)
      VALUES ($1, 'post_approved', $2, NOW())
    `, [user.id, petPost.id]);
    */

    // Todas las operaciones se realizaron correctamente
    return petPost;
  });
};