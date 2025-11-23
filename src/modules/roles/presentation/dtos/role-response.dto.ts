import { MemberRole } from '../../domain/member-role.aggregate';
import { RoleType } from '../../../../core/common/constants';

export class RoleResponseDto {
  roleId: number;
  memberId: number;
  roleGeneral: RoleType;
  createdAt: Date;
  updatedAt: Date;

  static fromDomain(role: MemberRole): RoleResponseDto {
    const dto = new RoleResponseDto();
    dto.roleId = role.id!;
    dto.memberId = role.memberId;
    dto.roleGeneral = role.roleGeneral;
    dto.createdAt = role.createdAt!;
    dto.updatedAt = role.updatedAt!;
    return dto;
  }

  static fromDomainArray(roles: MemberRole[]): RoleResponseDto[] {
    return roles.map((role) => this.fromDomain(role));
  }
}
