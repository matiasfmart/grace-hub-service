import { MemberResponseDto } from './member-response.dto';
import { MemberWithAssignmentsReadModel } from '../../domain/read-models/member-with-assignments.read-model';
import { PaginatedMembersResult } from '../../domain/read-models/member-query.types';

/**
 * DTO for paginated members response
 * Presentation Layer - formats response for HTTP
 */
export class PaginatedMembersResponseDto {
  data: MemberResponseDto[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;

  static fromResult(
    result: PaginatedMembersResult<MemberWithAssignmentsReadModel>
  ): PaginatedMembersResponseDto {
    const dto = new PaginatedMembersResponseDto();
    dto.data = result.data.map((member) => MemberResponseDto.fromReadModel(member));
    dto.totalCount = result.totalCount;
    dto.page = result.page;
    dto.pageSize = result.pageSize;
    dto.totalPages = result.totalPages;
    return dto;
  }
}
