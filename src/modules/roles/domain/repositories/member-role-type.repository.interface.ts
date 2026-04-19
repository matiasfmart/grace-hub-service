import { EcclesiasticalRole } from '../../../members/domain/read-models/member-with-assignments.read-model';

/**
 * Repository interface for the member_roles join table.
 * Manages assignment / unassignment of ecclesiastical labels to members.
 *
 * Defined in the Domain layer following Dependency Inversion Principle.
 * Infrastructure will provide the TypeORM implementation.
 */
export interface IMemberRoleTypeRepository {
  /**
   * Return all ecclesiastical roles assigned to a member.
   */
  findByMemberId(memberId: number): Promise<EcclesiasticalRole[]>;

  /**
   * Assign an ecclesiastical label to a member.
   * Is a no-op (idempotent) if the assignment already exists.
   */
  assign(memberId: number, roleTypeId: number): Promise<void>;

  /**
   * Unassign an ecclesiastical label from a member.
   * Is a no-op if the assignment does not exist.
   */
  unassign(memberId: number, roleTypeId: number): Promise<void>;

  /**
   * Check whether a specific label is already assigned to a member.
   */
  isAssigned(memberId: number, roleTypeId: number): Promise<boolean>;
}

// Injection token
export const MEMBER_ROLE_TYPE_REPOSITORY = Symbol('MEMBER_ROLE_TYPE_REPOSITORY');
