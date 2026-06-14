import { MemberCount, MemberRoleSummary } from '../../domain/repositories/member.repository.interface';

export class MemberCountResponseDto {
  total: number;

  static fromReadModel(data: MemberCount): MemberCountResponseDto {
    const dto = new MemberCountResponseDto();
    dto.total = data.total;
    return dto;
  }
}

export class MemberRoleSummaryResponseDto {
  gdiGuides: number;
  gdiMentors: number;
  areaLeaders: number;
  areaMentors: number;

  static fromReadModel(data: MemberRoleSummary): MemberRoleSummaryResponseDto {
    const dto = new MemberRoleSummaryResponseDto();
    dto.gdiGuides = data.gdiGuides;
    dto.gdiMentors = data.gdiMentors;
    dto.areaLeaders = data.areaLeaders;
    dto.areaMentors = data.areaMentors;
    return dto;
  }
}
