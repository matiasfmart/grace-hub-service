import { DomainEvent } from '../../../../core/domain/base/domain-event';
import { Member } from '../member.aggregate';

export class MemberCreatedEvent implements DomainEvent {
  public readonly occurredOn: Date;
  public readonly eventName: string = 'MemberCreated';

  constructor(public readonly member: Member) {
    this.occurredOn = new Date();
  }
}
