import { DomainEvent } from '../../../../../core/domain/base/domain-event';
import { Attendance } from '../attendance.aggregate';

export class AttendanceRecordedEvent implements DomainEvent {
  public readonly occurredOn: Date;
  public readonly eventName: string = 'attendance.recorded';

  constructor(public readonly attendance: Attendance) {
    this.occurredOn = new Date();
  }
}
