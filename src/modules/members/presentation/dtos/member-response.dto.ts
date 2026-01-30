import { Member } from '../../domain/member.aggregate';
import { MemberStatus } from '../../../../core/common/constants/status.constants';

/**
 * Response DTO for Member
 * Maps Domain Aggregate to API response
 */
export class MemberResponseDto {
  memberId: number;
  firstName: string;
  lastName: string;
  fullName: string;
  contact?: string;
  status: MemberStatus;
  birthDate?: string;
  baptismDate?: string;
  joinDate?: string;
  bibleStudy: boolean;
  typeBibleStudy?: string;
  address?: string;
  createdAt: string;
  updatedAt: string;

  /**
   * Formats a Date to YYYY-MM-DD string for DATE columns
   */
  private static toDateString(date: Date | undefined): string | undefined {
    if (!date) return undefined;
    return date.toISOString().split('T')[0];
  }

  static fromDomain(member: Member): MemberResponseDto {
    const dto = new MemberResponseDto();

    dto.memberId = member.id!;
    dto.firstName = member.name.firstName;
    dto.lastName = member.name.lastName;
    dto.fullName = member.name.fullName;
    dto.contact = member.contact?.value;
    dto.status = member.status;
    // DATE columns: YYYY-MM-DD format
    dto.birthDate = this.toDateString(member.birthDate);
    dto.baptismDate = this.toDateString(member.baptismDate);
    dto.joinDate = this.toDateString(member.joinDate);
    dto.bibleStudy = member.bibleStudy;
    dto.typeBibleStudy = member.typeBibleStudy;
    dto.address = member.address;
    // TIMESTAMP columns: Full ISO format
    dto.createdAt = member.createdAt.toISOString();
    dto.updatedAt = member.updatedAt.toISOString();

    return dto;
  }
}
