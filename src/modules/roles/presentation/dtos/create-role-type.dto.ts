import { IsString, MinLength, MaxLength } from 'class-validator';

/**
 * DTO: Create Role Type
 * 
 * Validates the input for creating a new ecclesiastical label.
 */
export class CreateRoleTypeDto {
  @IsString()
  @MinLength(2, { message: 'Name must be at least 2 characters' })
  @MaxLength(50, { message: 'Name cannot exceed 50 characters' })
  name: string;
}
