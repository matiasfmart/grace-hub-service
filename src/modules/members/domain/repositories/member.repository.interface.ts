import { Member } from '../member.aggregate';
import { RecordStatus } from '../../../../core/common/constants/status.constants';
import { MemberWithAssignmentsReadModel } from '../read-models/member-with-assignments.read-model';
import { MemberFilterOptions, PaginatedMembersResult } from '../read-models/member-query.types';

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
}

// Token for dependency injection
export const MEMBER_REPOSITORY = Symbol('MEMBER_REPOSITORY');
