import { AggregateRoot } from '../../../core/domain/base/aggregate-root';
import { SeriesName } from './value-objects/series-name.vo';
import { MeetingCreatedEvent } from './events/meeting-created.event';
import { MeetingType } from '../../../core/common/constants/status.constants';

export class Meeting extends AggregateRoot {
  private constructor(
    private readonly _id: number | undefined,
    private _seriesName: SeriesName,
    private _date: Date,
    private _type: MeetingType,
    private readonly _createdAt?: Date,
    private _updatedAt?: Date,
  ) {
    super();
  }

  public static create(
    seriesName: SeriesName,
    date: Date,
    type: MeetingType,
  ): Meeting {
    const meeting = new Meeting(
      undefined,
      seriesName,
      date,
      type,
      new Date(),
      new Date(),
    );
    meeting.addDomainEvent(new MeetingCreatedEvent(meeting));
    return meeting;
  }

  public static reconstitute(
    id: number,
    seriesName: SeriesName,
    date: Date,
    type: MeetingType,
    createdAt: Date,
    updatedAt: Date,
  ): Meeting {
    return new Meeting(id, seriesName, date, type, createdAt, updatedAt);
  }

  public updateSeriesName(seriesName: SeriesName): void {
    this._seriesName = seriesName;
    this._updatedAt = new Date();
  }

  public updateDate(date: Date): void {
    this._date = date;
    this._updatedAt = new Date();
  }

  get id(): number | undefined {
    return this._id;
  }

  get seriesName(): SeriesName {
    return this._seriesName;
  }

  get date(): Date {
    return this._date;
  }

  get type(): MeetingType {
    return this._type;
  }

  get createdAt(): Date | undefined {
    return this._createdAt;
  }

  get updatedAt(): Date | undefined {
    return this._updatedAt;
  }
}
