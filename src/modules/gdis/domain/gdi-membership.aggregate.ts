import { AggregateRoot } from '../../../core/domain/base/aggregate-root';

/**
 * Aggregate Root: GDI Membership
 *
 * Represents the relationship between a Member and a GDI
 * Business Rules:
 * - A member can only belong to ONE GDI (enforced by DB constraint)
 * - A GDI can have multiple members
 * - Members of any status can belong to a GDI
 */
export class GdiMembership extends AggregateRoot {
  private constructor(
    private readonly _id: number | undefined,
    private readonly _gdiId: number,
    private readonly _memberId: number,
  ) {
    super();
  }

  /**
   * Factory method to create a new GDI Membership
   */
  public static create(gdiId: number, memberId: number): GdiMembership {
    if (!gdiId || gdiId <= 0) {
      throw new Error('GDI ID must be a positive number');
    }
    if (!memberId || memberId <= 0) {
      throw new Error('Member ID must be a positive number');
    }

    return new GdiMembership(undefined, gdiId, memberId);
  }

  /**
   * Factory method to reconstitute from persistence
   */
  public static reconstitute(
    id: number,
    gdiId: number,
    memberId: number,
  ): GdiMembership {
    return new GdiMembership(id, gdiId, memberId);
  }

  // Getters
  get id(): number | undefined {
    return this._id;
  }

  get gdiId(): number {
    return this._gdiId;
  }

  get memberId(): number {
    return this._memberId;
  }
}
