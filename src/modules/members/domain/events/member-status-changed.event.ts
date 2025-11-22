import { DomainEvent } from '../../../../core/domain/base/domain-event';
import { Member } from '../member.aggregate';
import { MemberStatus } from '../../../../core/common/constants';

export class MemberStatusChangedEvent implements DomainEvent {
  public readonly occurredOn: Date;
  public readonly eventName: string = 'MemberStatusChanged';

  constructor(
    public readonly member: Member,
    public readonly oldStatus: MemberStatus,
    public readonly newStatus: MemberStatus,
  ) {
    this.occurredOn = new Date();
  }
}
