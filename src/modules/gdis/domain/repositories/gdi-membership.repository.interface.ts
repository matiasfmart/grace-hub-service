import { GdiMembership } from '../gdi-membership.aggregate';

/**
 * Repository Interface for GDI Membership Aggregate
 *
 * Defined in Domain Layer (Dependency Inversion Principle)
 * Implemented in Infrastructure Layer
 */
export interface IGdiMembershipRepository {
  /**
   * Add a member to a GDI
   */
  save(membership: GdiMembership): Promise<GdiMembership>;

  /**
   * Find all memberships for a specific GDI
   */
  findByGdiId(gdiId: number): Promise<GdiMembership[]>;

  /**
   * Find membership by member ID (member can only be in one GDI)
   */
  findByMemberId(memberId: number): Promise<GdiMembership | null>;

  /**
   * Get all member IDs for a GDI
   */
  getMemberIdsByGdiId(gdiId: number): Promise<number[]>;

  /**
   * Remove a member from a GDI
   */
  deleteByGdiIdAndMemberId(gdiId: number, memberId: number): Promise<void>;

  /**
   * Remove all memberships for a member (when reassigning)
   */
  deleteByMemberId(memberId: number): Promise<void>;

  /**
   * Check if a member is already assigned to any GDI
   */
  memberHasGdi(memberId: number): Promise<boolean>;
}

/**
 * Injection token for GDI Membership Repository
 */
export const GDI_MEMBERSHIP_REPOSITORY = Symbol('GDI_MEMBERSHIP_REPOSITORY');
