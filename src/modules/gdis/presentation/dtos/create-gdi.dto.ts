import { IsString, IsNumber, IsOptional, MaxLength } from 'class-validator';

/**
 * DTO: Create GDI Request
 *
 * Validates HTTP request body for creating a GDI
 */
export class CreateGdiDto {
  @IsString()
  @MaxLength(255)
  name: string;

  @IsOptional()
  @IsNumber()
  guideId?: number;

  @IsOptional()
  @IsNumber()
  mentorId?: number;
}
