import { AggregateRoot } from '../../../core/domain/base/aggregate-root';

/**
 * Aggregate Root: Area Membership
 *
 * Represents the relationship between a Member and an Area
 * Business Rules:
 * - A member can belong to MULTIPLE Areas
 * - An Area can have multiple members
 * - Only ACTIVE members can be assigned to an Area
 * - Member must belong to a GDI to be assigned to an Area (validated at use case level)
 */
export class AreaMembership extends AggregateRoot {
  private constructor(
    private readonly _id: number | undefined,
    private readonly _areaId: number,
    private readonly _memberId: number,
  ) {
    super();
  }

  /**
   * Factory method to create a new Area Membership
   */
  public static create(areaId: number, memberId: number): AreaMembership {
    if (!areaId || areaId <= 0) {
      throw new Error('Area ID must be a positive number');
    }
    if (!memberId || memberId <= 0) {
      throw new Error('Member ID must be a positive number');
    }

    return new AreaMembership(undefined, areaId, memberId);
  }

  /**
   * Factory method to reconstitute from persistence
   */
  public static reconstitute(
    id: number,
    areaId: number,
    memberId: number,
  ): AreaMembership {
    return new AreaMembership(id, areaId, memberId);
  }

  // Getters
  get id(): number | undefined {
    return this._id;
  }

  get areaId(): number {
    return this._areaId;
  }

  get memberId(): number {
    return this._memberId;
  }
}
