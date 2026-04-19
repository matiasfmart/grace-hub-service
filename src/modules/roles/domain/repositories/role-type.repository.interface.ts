import { RoleType } from '../role-type.aggregate';

/**
 * Repository Interface: Role Type
 * 
 * Defines the contract for persisting RoleType aggregates.
 * Follows Dependency Inversion Principle - defined in Domain, implemented in Infrastructure.
 */
export interface IRoleTypeRepository {
  /**
   * Find all role types
   */
  findAll(): Promise<RoleType[]>;

  /**
   * Find a role type by ID
   */
  findById(id: number): Promise<RoleType | null>;

  /**
   * Find a role type by name (case-insensitive)
   */
  findByName(name: string): Promise<RoleType | null>;

  /**
   * Save a role type (create or update)
   */
  save(roleType: RoleType): Promise<RoleType>;

  /**
   * Delete a role type by ID
   */
  delete(id: number): Promise<void>;

  /**
   * Check if a name already exists (for unique constraint)
   */
  existsByName(name: string): Promise<boolean>;
}

export const ROLE_TYPE_REPOSITORY = Symbol('ROLE_TYPE_REPOSITORY');
