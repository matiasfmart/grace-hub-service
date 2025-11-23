import { AggregateRoot } from '../../../../core/domain/base/aggregate-root';
import { AreaName } from './value-objects/area-name.vo';
import { AreaCreatedEvent } from './events/area-created.event';

/**
 * Aggregate Root: Area
 *
 * Represents a ministry area in the church
 * Business Rules:
 * - Must have a valid name
 * - Description is optional
 * - Can update name and description
 */
export class Area extends AggregateRoot {
  private constructor(
    private readonly _id: number | undefined,
    private _name: AreaName,
    private _description?: string,
    private readonly _createdAt?: Date,
    private _updatedAt?: Date,
  ) {
    super();
  }

  /**
   * Factory method to create a new Area
   */
  public static create(name: AreaName, description?: string): Area {
    const area = new Area(
      undefined,
      name,
      description,
      new Date(),
      new Date(),
    );

    area.addDomainEvent(new AreaCreatedEvent(area));

    return area;
  }

  /**
   * Factory method to reconstitute from persistence
   */
  public static reconstitute(
    id: number,
    name: AreaName,
    description: string | undefined,
    createdAt: Date,
    updatedAt: Date,
  ): Area {
    return new Area(id, name, description, createdAt, updatedAt);
  }

  /**
   * Business Logic: Update Area name
   */
  public updateName(name: AreaName): void {
    this._name = name;
    this._updatedAt = new Date();
  }

  /**
   * Business Logic: Update Area description
   */
  public updateDescription(description?: string): void {
    this._description = description;
    this._updatedAt = new Date();
  }

  // Getters
  get id(): number | undefined {
    return this._id;
  }

  get name(): AreaName {
    return this._name;
  }

  get description(): string | undefined {
    return this._description;
  }

  get createdAt(): Date | undefined {
    return this._createdAt;
  }

  get updatedAt(): Date | undefined {
    return this._updatedAt;
  }
}
