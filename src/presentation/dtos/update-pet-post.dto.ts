import { IsString, IsOptional, IsDate, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdatePetPostDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  petImage?: string;

  @IsString()
  @IsOptional()
  petType?: string;

  @IsString()
  @IsOptional()
  petName?: string;

  @IsString()
  @IsOptional()
  location?: string;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  lostDate?: Date;
}