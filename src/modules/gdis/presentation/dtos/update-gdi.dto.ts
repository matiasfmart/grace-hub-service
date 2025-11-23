import { IsString, IsNumber, IsOptional, MaxLength } from 'class-validator';

/**
 * DTO: Update GDI Request
 *
 * Validates HTTP request body for updating a GDI
 */
export class UpdateGdiDto {
  @IsOptional()
  @IsString()
  @MaxLength(255)
  name?: string;

  @IsOptional()
  @IsNumber()
  guideId?: number;

  @IsOptional()
  @IsNumber()
  mentorId?: number;
}
