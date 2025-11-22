import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateAreaDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsNumber()
  leaderId?: number;

  @IsOptional()
  @IsNumber()
  mentorId?: number;
}
