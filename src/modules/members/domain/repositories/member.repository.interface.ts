import { Member } from '../member.aggregate';
import { RecordStatus } from '../../../../core/common/constants/status.constants';
import { MemberWithAssignmentsReadModel } from '../read-models/member-with-assignments.read-model';
import { MemberFilterOptions, PaginatedMembersResult } from '../read-models/member-query.types';

/**
 * Aggregated count of active members.
 * Used by GET /members/count — avoids fetching all rows.
 */
export interface MemberCount {
  total: number;
}

/**
 * Aggregated role summary for dashboard charts.
 * Used by GET /members/role-summary — avoids fetching all rows.
 */
export interface MemberRoleSummary {
  gdiGuides: number;
  gdiMentors: number;
  areaLeaders: number;
  areaMentors: number;
}

/**
 * Repository interface defined in the Domain layer
 * Infrastructure layer will implement this (Dependency Inversion Principle)
 */
export interface IMemberRepository {
  // Command operations (use Aggregate)
  save(member: Member): Promise<Member>;
  findById(id: number): Promise<Member | null>;
  findAll(): Promise<Member[]>;
  findByRecordStatus(recordStatus: RecordStatus): Promise<Member[]>;
  delete(id: number): Promise<void>;
  exists(id: number): Promise<boolean>;

  // Query operations (use Read Model)
  /**
   * Find all members with enriched data (GDI, Areas, Roles)
   * Returns read model optimized for display
   */
  findAllWithAssignments(): Promise<MemberWithAssignmentsReadModel[]>;

  /**
   * Find a member by ID with enriched data (GDI, Areas, Roles)
   * Returns read model optimized for display
   */
  findByIdWithAssignments(id: number): Promise<MemberWithAssignmentsReadModel | null>;

  /**
   * Find members with filters, search, and pagination
   * Server-side filtering for scalability
   */
  findAllWithAssignmentsFiltered(
    options: MemberFilterOptions
  ): Promise<PaginatedMembersResult<MemberWithAssignmentsReadModel>>;

  // Aggregation operations (for performance — avoid full-table fetches)
  countActive(): Promise<MemberCount>;
  getRoleSummary(): Promise<MemberRoleSummary>;
}

// Token for dependency injection
export const MEMBER_REPOSITORY = Symbol('MEMBER_REPOSITORY');
