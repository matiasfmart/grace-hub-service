import { DomainEvent } from '../../../../../core/domain/base/domain-event';
import { Meeting } from '../meeting.aggregate';

export class MeetingCreatedEvent implements DomainEvent {
  public readonly occurredOn: Date;
  public readonly eventName: string = 'meeting.created';

  constructor(public readonly meeting: Meeting) {
    this.occurredOn = new Date();
  }
}
