import { DomainEvent } from '../../../../core/domain/base/domain-event';
import { Member } from '../member.aggregate';
import { RecordStatus } from '../../../../core/common/constants/status.constants';

export class MemberRecordStatusChangedEvent implements DomainEvent {
  public readonly occurredOn: Date;
  public readonly eventName: string = 'MemberRecordStatusChanged';

  constructor(
    public readonly member: Member,
    public readonly oldStatus: RecordStatus,
    public readonly newStatus: RecordStatus,
  ) {
    this.occurredOn = new Date();
  }
}
