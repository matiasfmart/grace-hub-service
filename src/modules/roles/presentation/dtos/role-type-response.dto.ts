import { RoleType } from '../../domain/role-type.aggregate';

/**
 * DTO: Role Type Response
 * 
 * API response format for role type data.
 */
export class RoleTypeResponseDto {
  roleTypeId: number;
  name: string;
  createdAt: string;

  static fromDomain(roleType: RoleType): RoleTypeResponseDto {
    const dto = new RoleTypeResponseDto();
    dto.roleTypeId = roleType.id!;
    dto.name = roleType.name.value;
    dto.createdAt = roleType.createdAt?.toISOString() || new Date().toISOString();
    return dto;
  }

  static fromDomainArray(roleTypes: RoleType[]): RoleTypeResponseDto[] {
    return roleTypes.map((rt) => this.fromDomain(rt));
  }
}
