import { MemberWithAssignmentsReadModel, MemberRoleType as DomainMemberRoleType } from '../../domain/read-models/member-with-assignments.read-model';
import { Member } from '../../domain/member.aggregate';
import { MemberStatus } from '../../../../core/common/constants/status.constants';

/**
 * DTO for assigned GDI info
 */
export class AssignedGdiDto {
  id: number;
  name: string;
}

/**
 * DTO for assigned Area info
 */
export class AssignedAreaDto {
  id: number;
  name: string;
}

/**
 * Member role types based on positions
 */
export type MemberRoleType = DomainMemberRoleType;

/**
 * Response DTO for Member
 * Maps Read Model or Aggregate to API response
 */
export class MemberResponseDto {
  memberId: number;
  firstName: string;
  lastName: string;
  fullName: string;
  contact?: string;
  status: string;
  birthDate?: string;
  baptismDate?: string;
  joinDate?: string;
  bibleStudy: boolean;
  typeBibleStudy?: string;
  address?: string;
  createdAt: string;
  updatedAt: string;

  // Enriched data from memberships
  assignedGdi?: AssignedGdiDto;
  assignedAreas: AssignedAreaDto[];
  roles: MemberRoleType[];

  /**
   * Formats a Date to YYYY-MM-DD string for DATE columns
   */
  private static toDateString(date: Date | undefined): string | undefined {
    if (!date) return undefined;
    return date.toISOString().split('T')[0];
  }

  /**
   * Create DTO from Read Model (for queries with assignments)
   */
  static fromReadModel(readModel: MemberWithAssignmentsReadModel): MemberResponseDto {
    const dto = new MemberResponseDto();

    dto.memberId = readModel.id;
    dto.firstName = readModel.firstName;
    dto.lastName = readModel.lastName;
    dto.fullName = readModel.fullName;
    dto.contact = readModel.contact;
    dto.status = readModel.status;
    dto.birthDate = this.toDateString(readModel.birthDate);
    dto.baptismDate = this.toDateString(readModel.baptismDate);
    dto.joinDate = this.toDateString(readModel.joinDate);
    dto.bibleStudy = readModel.bibleStudy;
    dto.typeBibleStudy = readModel.typeBibleStudy;
    dto.address = readModel.address;
    dto.createdAt = readModel.createdAt.toISOString();
    dto.updatedAt = readModel.updatedAt.toISOString();

    // Enriched data directly from read model
    dto.assignedGdi = readModel.assignedGdi
      ? { id: readModel.assignedGdi.id, name: readModel.assignedGdi.name }
      : undefined;
    dto.assignedAreas = readModel.assignedAreas.map((area) => ({
      id: area.id,
      name: area.name,
    }));
    dto.roles = readModel.roles;

    return dto;
  }

  /**
   * Create DTO from Aggregate (for command responses without assignments)
   */
  static fromDomain(member: Member): MemberResponseDto {
    const dto = new MemberResponseDto();

    dto.memberId = member.id!;
    dto.firstName = member.name.firstName;
    dto.lastName = member.name.lastName;
    dto.fullName = member.name.fullName;
    dto.contact = member.contact?.value;
    dto.status = member.status;
    dto.birthDate = this.toDateString(member.birthDate);
    dto.baptismDate = this.toDateString(member.baptismDate);
    dto.joinDate = this.toDateString(member.joinDate);
    dto.bibleStudy = member.bibleStudy;
    dto.typeBibleStudy = member.typeBibleStudy;
    dto.address = member.address;
    dto.createdAt = member.createdAt.toISOString();
    dto.updatedAt = member.updatedAt.toISOString();

    // No enriched data from aggregate (use findByIdWithAssignments for that)
    dto.assignedGdi = undefined;
    dto.assignedAreas = [];
    dto.roles = [];

    return dto;
  }
}
