import { PetPost, PetPostStatus } from '../../../data/postgres/models/pet-post.model';
import { User } from '../../../data/postgres/models/user.model';
import { TransactionService } from '../../../data/postgres/transaction.service';

export const approvePostAndNotifyUser = async (postId: string, adminComment: string): Promise<PetPost> => {
  return await TransactionService.executeTransaction(async (queryRunner) => {
    
    const petPostRepo = queryRunner.manager.getRepository(PetPost);
    const userRepo = queryRunner.manager.getRepository(User);

    
    const petPost = await petPostRepo.findOne({ 
      where: { id: postId },
      relations: ['user']
    });

    if (!petPost) {
      throw new Error('Pet post not found');
    }

    
    petPost.status = PetPostStatus.APPROVED;
    
    
    
    petPost.description += `\n\nAdmin comment: ${adminComment}`;
    
    await petPostRepo.save(petPost);

    
    const user = petPost.user;
    
  
    
    await userRepo.save(user);

  
    return petPost;
  });
};