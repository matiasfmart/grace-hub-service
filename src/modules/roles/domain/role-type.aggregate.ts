import { AggregateRoot } from '../../../core/domain/base/aggregate-root';
import { RoleTypeName } from './value-objects/role-type-name.vo';

/**
 * Aggregate Root: Role Type
 * 
 * Represents an ecclesiastical label that can be assigned to members.
 * These are configurable by administrators for each congregation.
 * 
 * Examples: Pastor, Diácono, Anciano, Tesorero, Ujier
 * 
 * See ADR-003: Sistema Híbrido de Roles
 * 
 * Note: These are NOT functional roles (Guía, Líder, Mentor) which are
 * derived from assignments. These are informational labels only.
 */
export class RoleType extends AggregateRoot {
  private constructor(
    private readonly _id: number | undefined,
    private _name: RoleTypeName,
    private readonly _createdAt?: Date,
  ) {
    super();
  }

  /**
   * Factory: Create a new Role Type
   */
  public static create(name: RoleTypeName): RoleType {
    return new RoleType(undefined, name, new Date());
  }

  /**
   * Reconstitute from persistence
   */
  public static reconstitute(
    id: number,
    name: RoleTypeName,
    createdAt: Date,
  ): RoleType {
    return new RoleType(id, name, createdAt);
  }

  // ============================================
  // Getters
  // ============================================

  get id(): number | undefined {
    return this._id;
  }

  get name(): RoleTypeName {
    return this._name;
  }

  get createdAt(): Date | undefined {
    return this._createdAt;
  }

  // ============================================
  // Business Methods
  // ============================================

  /**
   * Update the name of this role type
   */
  public updateName(newName: RoleTypeName): void {
    this._name = newName;
  }
}
