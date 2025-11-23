import { DomainEvent } from '../../../../core/domain/base/domain-event';
import { MemberRole } from '../member-role.aggregate';

export class RoleAssignedEvent implements DomainEvent {
  public readonly occurredOn: Date;
  public readonly eventName: string = 'role.assigned';

  constructor(public readonly role: MemberRole) {
    this.occurredOn = new Date();
  }
}
