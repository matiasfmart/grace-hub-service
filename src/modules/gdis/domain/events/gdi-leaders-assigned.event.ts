import { DomainEvent } from '../../../../core/domain/base/domain-event';
import { Gdi } from '../gdi.aggregate';

/**
 * Domain Event: GDI Leaders Assigned
 *
 * Published when guide or mentor is assigned to a GDI
 */
export class GdiLeadersAssignedEvent implements DomainEvent {
  public readonly occurredOn: Date;
  public readonly eventName: string = 'gdi.leaders.assigned';

  constructor(
    public readonly gdi: Gdi,
    public readonly guideId?: number,
    public readonly mentorId?: number,
  ) {
    this.occurredOn = new Date();
  }
}
