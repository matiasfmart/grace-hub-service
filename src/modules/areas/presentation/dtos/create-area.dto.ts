import { IsString, IsOptional, MaxLength } from 'class-validator';

export class CreateAreaDto {
  @IsString()
  @MaxLength(255)
  name: string;

  @IsOptional()
  @IsString()
  description?: string;
}
