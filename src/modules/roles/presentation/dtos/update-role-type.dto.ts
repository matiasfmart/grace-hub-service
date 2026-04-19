import { IsString, MinLength, MaxLength } from 'class-validator';

/**
 * DTO: Update Role Type
 *
 * Validates input for renaming an existing ecclesiastical label.
 */
export class UpdateRoleTypeDto {
  @IsString()
  @MinLength(2, { message: 'Name must be at least 2 characters' })
  @MaxLength(50, { message: 'Name cannot exceed 50 characters' })
  name: string;
}
