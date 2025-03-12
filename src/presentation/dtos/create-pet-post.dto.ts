import { IsString, IsNotEmpty, IsOptional, IsNumber, IsDate, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';

export class CreatePetPostDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsOptional()
  petImage?: string;

  @IsString()
  @IsNotEmpty()
  petType: string; // Por ejemplo: "perro", "gato", etc.

  @IsString()
  @IsNotEmpty()
  petName: string;

  @IsString()
  @IsNotEmpty()
  location: string;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  lostDate?: Date;

  @IsUUID()
  userId: string; // ID del usuario que crea la publicación
}