import { AreaMembership } from '../area-membership.aggregate';

/**
 * Repository Interface for Area Membership Aggregate
 *
 * Defined in Domain Layer (Dependency Inversion Principle)
 * Implemented in Infrastructure Layer
 */
export interface IAreaMembershipRepository {
  /**
   * Add a member to an Area
   */
  save(membership: AreaMembership): Promise<AreaMembership>;

  /**
   * Find all memberships for a specific Area
   */
  findByAreaId(areaId: number): Promise<AreaMembership[]>;

  /**
   * Find all areas for a specific member
   */
  findByMemberId(memberId: number): Promise<AreaMembership[]>;

  /**
   * Get all member IDs for an Area
   */
  getMemberIdsByAreaId(areaId: number): Promise<number[]>;

  /**
   * Remove a member from an Area
   */
  deleteByAreaIdAndMemberId(areaId: number, memberId: number): Promise<void>;

  /**
   * Remove all area memberships for a member
   */
  deleteByMemberId(memberId: number): Promise<void>;

  /**
   * Check if a specific membership exists
   */
  exists(areaId: number, memberId: number): Promise<boolean>;
}

/**
 * Injection token for Area Membership Repository
 */
export const AREA_MEMBERSHIP_REPOSITORY = Symbol('AREA_MEMBERSHIP_REPOSITORY');
