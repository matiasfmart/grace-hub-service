import { AggregateRoot } from '../../../core/domain/base/aggregate-root';
import { TitheRecordedEvent } from './events/tithe-recorded.event';

export class Tithe extends AggregateRoot {
  private constructor(
    private readonly _id: number | undefined,
    private readonly _memberId: number,
    private readonly _year: number,
    private readonly _month: number,
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
    );
    tithe.addDomainEvent(new TitheRecordedEvent(tithe));
    return tithe;
  }

  public static reconstitute(
    id: number,
    memberId: number,
    year: number,
    month: number,
  ): Tithe {
    return new Tithe(id, memberId, year, month);
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

}
