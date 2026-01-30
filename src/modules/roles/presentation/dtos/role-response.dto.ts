import { MemberRole } from '../../domain/member-role.aggregate';
import { RoleType } from '../../../../core/common/constants/status.constants';

export class RoleResponseDto {
  roleId: number;
  memberId: number;
  roleGeneral: RoleType;
  createdAt: string;  // ISO string for TIMESTAMP
  updatedAt: string;  // ISO string for TIMESTAMP

  static fromDomain(role: MemberRole): RoleResponseDto {
    const dto = new RoleResponseDto();
    dto.roleId = role.id!;
    dto.memberId = role.memberId;
    dto.roleGeneral = role.roleGeneral;
    dto.createdAt = role.createdAt!.toISOString();
    dto.updatedAt = role.updatedAt!.toISOString();
    return dto;
  }

  static fromDomainArray(roles: MemberRole[]): RoleResponseDto[] {
    return roles.map((role) => this.fromDomain(role));
  }
}
