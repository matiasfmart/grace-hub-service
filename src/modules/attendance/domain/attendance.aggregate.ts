import { AggregateRoot } from '../../../core/domain/base/aggregate-root';
import { AttendanceRecordedEvent } from './events/attendance-recorded.event';

export class Attendance extends AggregateRoot {
  private constructor(
    private readonly _id: number | undefined,
    private readonly _meetingId: number,
    private readonly _memberId: number,
    private _wasPresent: boolean,
    private readonly _createdAt?: Date,
    private _updatedAt?: Date,
  ) {
    super();
  }

  public static create(
    meetingId: number,
    memberId: number,
    wasPresent: boolean,
  ): Attendance {
    const attendance = new Attendance(
      undefined,
      meetingId,
      memberId,
      wasPresent,
      new Date(),
      new Date(),
    );
    attendance.addDomainEvent(new AttendanceRecordedEvent(attendance));
    return attendance;
  }

  public static reconstitute(
    id: number,
    meetingId: number,
    memberId: number,
    wasPresent: boolean,
    createdAt: Date,
    updatedAt: Date,
  ): Attendance {
    return new Attendance(id, meetingId, memberId, wasPresent, createdAt, updatedAt);
  }

  public updatePresence(wasPresent: boolean): void {
    this._wasPresent = wasPresent;
    this._updatedAt = new Date();
  }

  get id(): number | undefined {
    return this._id;
  }

  get meetingId(): number {
    return this._meetingId;
  }

  get memberId(): number {
    return this._memberId;
  }

  get wasPresent(): boolean {
    return this._wasPresent;
  }

  get createdAt(): Date | undefined {
    return this._createdAt;
  }

  get updatedAt(): Date | undefined {
    return this._updatedAt;
  }
}
