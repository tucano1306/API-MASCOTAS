import { IsString, IsNotEmpty, IsEnum } from 'class-validator';
import { PetPostStatus } from '../../data/postgres/models/pet-post.model';

export class ApproveRejectPetPostDto {
  @IsEnum(PetPostStatus)
  @IsNotEmpty()
  status: PetPostStatus;

  @IsString()
  @IsNotEmpty()
  adminComment: string;
}