import { Member } from '../../domain/member.aggregate';
import { MemberStatus } from '../../../../core/common/constants';

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
  createdAt: string;
  updatedAt: string;

  static fromDomain(member: Member): MemberResponseDto {
    const dto = new MemberResponseDto();

    dto.memberId = member.id!;
    dto.firstName = member.name.firstName;
    dto.lastName = member.name.lastName;
    dto.fullName = member.name.fullName;
    dto.contact = member.contact?.value;
    dto.status = member.status;
    dto.birthDate = member.birthDate?.toISOString();
    dto.baptismDate = member.baptismDate?.toISOString();
    dto.joinDate = member.joinDate?.toISOString();
    dto.bibleStudy = member.bibleStudy;
    dto.typeBibleStudy = member.typeBibleStudy;
    dto.createdAt = member.createdAt.toISOString();
    dto.updatedAt = member.updatedAt.toISOString();

    return dto;
  }
}
