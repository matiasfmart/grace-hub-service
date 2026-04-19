import { IsInt, IsPositive } from 'class-validator';

/**
 * DTO: Assign Role Type to Member
 * Body for POST /members/:id/role-types
 */
export class AssignRoleTypeDto {
  @IsInt()
  @IsPositive()
  roleTypeId: number;
}
