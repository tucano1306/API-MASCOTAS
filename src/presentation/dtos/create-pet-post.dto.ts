import { 
  IsString, 
  IsNotEmpty, 
  IsOptional, 
  IsEnum, 
  IsBoolean, 
  IsUUID 
} from 'class-validator';
import { PetPostStatus } from '../../data/postgres/models/pet-post.model'; // Importación desde el modelo real

export class CreatePetPostDto {
  @IsString()
  @IsNotEmpty()
  pet_name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsOptional()
  image_url?: string;

  @IsEnum(PetPostStatus)
  @IsOptional()
  status?: PetPostStatus = PetPostStatus.PENDING;

  @IsBoolean()
  @IsOptional()
  hasFound?: boolean = false;

  @IsUUID()
  @IsNotEmpty()
  user_id: string;
}