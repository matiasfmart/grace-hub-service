import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateGdiDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsNumber()
  guideId?: number;

  @IsOptional()
  @IsNumber()
  mentorId?: number;
}
