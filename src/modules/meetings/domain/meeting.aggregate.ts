import { AggregateRoot } from '../../../core/domain/base/aggregate-root';
import { MeetingCreatedEvent } from './events/meeting-created.event';

/**
 * Aggregate Root: Meeting (Instance)
 *
 * Represents a specific occurrence of a meeting from a series.
 * Linked to a meeting_series via seriesId.
 */
export class Meeting extends AggregateRoot {
  private constructor(
    private readonly _id: number | undefined,
    private _seriesId: number,
    private _date: Date,
    private _time: string | null,
    private _location: string | null,
    private _notes: string | null,
    private readonly _createdAt?: Date,
    private _updatedAt?: Date,
  ) {
    super();
  }

  public static create(
    seriesId: number,
    date: Date,
    options?: {
      time?: string;
      location?: string;
      notes?: string;
    },
  ): Meeting {
    const meeting = new Meeting(
      undefined,
      seriesId,
      date,
      options?.time || null,
      options?.location || null,
      options?.notes || null,
      new Date(),
      new Date(),
    );
    meeting.addDomainEvent(new MeetingCreatedEvent(meeting));
    return meeting;
  }

  public static reconstitute(
    id: number,
    seriesId: number,
    date: Date,
    time: string | null,
    location: string | null,
    notes: string | null,
    createdAt: Date,
    updatedAt: Date,
  ): Meeting {
    return new Meeting(id, seriesId, date, time, location, notes, createdAt, updatedAt);
  }

  public updateDate(date: Date): void {
    this._date = date;
    this._updatedAt = new Date();
  }

  public updateTime(time: string | null): void {
    this._time = time;
    this._updatedAt = new Date();
  }

  public updateLocation(location: string | null): void {
    this._location = location;
    this._updatedAt = new Date();
  }

  public updateNotes(notes: string | null): void {
    this._notes = notes;
    this._updatedAt = new Date();
  }

  get id(): number | undefined {
    return this._id;
  }

  get seriesId(): number {
    return this._seriesId;
  }

  get date(): Date {
    return this._date;
  }

  get time(): string | null {
    return this._time;
  }

  get location(): string | null {
    return this._location;
  }

  get notes(): string | null {
    return this._notes;
  }

  get createdAt(): Date | undefined {
    return this._createdAt;
  }

  get updatedAt(): Date | undefined {
    return this._updatedAt;
  }
}
