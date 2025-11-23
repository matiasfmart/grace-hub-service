import { AggregateRoot } from '../../../../core/domain/base/aggregate-root';
import { GdiName } from './value-objects/gdi-name.vo';
import { GdiCreatedEvent } from './events/gdi-created.event';
import { GdiLeadersAssignedEvent } from './events/gdi-leaders-assigned.event';
import { BusinessRuleViolationException } from '../../../../core/domain/exceptions/domain.exception';

/**
 * Aggregate Root: GDI (Grupo de Integración Discipular)
 *
 * Represents a small discipleship group in the church
 * Business Rules:
 * - Must have a valid name
 * - Guide and Mentor are optional but recommended
 * - Can assign/change leaders
 */
export class Gdi extends AggregateRoot {
  private constructor(
    private readonly _id: number | undefined,
    private _name: GdiName,
    private _guideId?: number,
    private _mentorId?: number,
    private readonly _createdAt?: Date,
    private _updatedAt?: Date,
  ) {
    super();
  }

  /**
   * Factory method to create a new GDI
   */
  public static create(
    name: GdiName,
    guideId?: number,
    mentorId?: number,
  ): Gdi {
    const gdi = new Gdi(
      undefined,
      name,
      guideId,
      mentorId,
      new Date(),
      new Date(),
    );

    gdi.addDomainEvent(new GdiCreatedEvent(gdi));

    return gdi;
  }

  /**
   * Factory method to reconstitute from persistence
   */
  public static reconstitute(
    id: number,
    name: GdiName,
    guideId: number | undefined,
    mentorId: number | undefined,
    createdAt: Date,
    updatedAt: Date,
  ): Gdi {
    return new Gdi(id, name, guideId, mentorId, createdAt, updatedAt);
  }

  /**
   * Business Logic: Assign leaders to the GDI
   */
  public assignLeaders(guideId?: number, mentorId?: number): void {
    if (!guideId && !mentorId) {
      throw new BusinessRuleViolationException(
        'At least one leader (guide or mentor) must be assigned',
      );
    }

    this._guideId = guideId;
    this._mentorId = mentorId;
    this._updatedAt = new Date();

    this.addDomainEvent(new GdiLeadersAssignedEvent(this, guideId, mentorId));
  }

  /**
   * Business Logic: Update GDI name
   */
  public updateName(name: GdiName): void {
    this._name = name;
    this._updatedAt = new Date();
  }

  // Getters
  get id(): number | undefined {
    return this._id;
  }

  get name(): GdiName {
    return this._name;
  }

  get guideId(): number | undefined {
    return this._guideId;
  }

  get mentorId(): number | undefined {
    return this._mentorId;
  }

  get createdAt(): Date | undefined {
    return this._createdAt;
  }

  get updatedAt(): Date | undefined {
    return this._updatedAt;
  }
}
