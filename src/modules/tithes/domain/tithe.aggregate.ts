import { AggregateRoot } from '../../../../core/domain/base/aggregate-root';
import { TitheRecordedEvent } from './events/tithe-recorded.event';

export class Tithe extends AggregateRoot {
  private constructor(
    private readonly _id: number | undefined,
    private readonly _memberId: number,
    private readonly _year: number,
    private readonly _month: number,
    private readonly _createdAt?: Date,
    private _updatedAt?: Date,
  ) {
    super();
  }

  public static create(
    memberId: number,
    year: number,
    month: number,
  ): Tithe {
    const tithe = new Tithe(
      undefined,
      memberId,
      year,
      month,
      new Date(),
      new Date(),
    );
    tithe.addDomainEvent(new TitheRecordedEvent(tithe));
    return tithe;
  }

  public static reconstitute(
    id: number,
    memberId: number,
    year: number,
    month: number,
    createdAt: Date,
    updatedAt: Date,
  ): Tithe {
    return new Tithe(id, memberId, year, month, createdAt, updatedAt);
  }

  get id(): number | undefined {
    return this._id;
  }

  get memberId(): number {
    return this._memberId;
  }

  get year(): number {
    return this._year;
  }

  get month(): number {
    return this._month;
  }

  get createdAt(): Date | undefined {
    return this._createdAt;
  }

  get updatedAt(): Date | undefined {
    return this._updatedAt;
  }
}
