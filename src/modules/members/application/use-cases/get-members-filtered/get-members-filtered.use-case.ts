import { Inject, Injectable } from '@nestjs/common';
import {
  IMemberRepository,
  MEMBER_REPOSITORY,
} from '../../../domain/repositories/member.repository.interface';
import { MemberWithAssignmentsReadModel } from '../../../domain/read-models/member-with-assignments.read-model';
import { PaginatedMembersResult } from '../../../domain/read-models/member-query.types';
import {
  GetMembersFilteredOptions,
  normalizePaginationOptions,
} from './get-members-filtered.options';

/**
 * Use Case: Get Members Filtered
 *
 * Retrieves members with optional filters, search, and pagination.
 * This is a Query operation (CQRS read side).
 *
 * Features:
 * - Full-text search on name and contact
 * - Filter by status, roles, GDI, and areas
 * - Server-side pagination for scalability
 */
@Injectable()
export class GetMembersFilteredUseCase {
  constructor(
    @Inject(MEMBER_REPOSITORY)
    private readonly memberRepository: IMemberRepository,
  ) {}

  async execute(
    options: GetMembersFilteredOptions = {}
  ): Promise<PaginatedMembersResult<MemberWithAssignmentsReadModel>> {
    const pagination = normalizePaginationOptions(options);

    return await this.memberRepository.findAllWithAssignmentsFiltered({
      page: pagination.page,
      pageSize: pagination.pageSize,
      offset: pagination.offset,
      searchTerm: options.searchTerm,
      statusFilters: options.statusFilters,
      roleFilters: options.roleFilters,
      gdiFilters: options.gdiFilters,
      areaFilters: options.areaFilters,
      joinDateFrom: options.joinDateFrom,
      joinDateTo: options.joinDateTo,
      ageMin: options.ageMin,
      ageMax: options.ageMax,
      sortBy: options.sortBy,
      sortOrder: options.sortOrder,
    });
  }
}
