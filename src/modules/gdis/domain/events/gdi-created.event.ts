import { DomainEvent } from '../../../../core/domain/base/domain-event';
import { Gdi } from '../gdi.aggregate';

/**
 * Domain Event: GDI Created
 *
 * Published when a new GDI is created
 */
export class GdiCreatedEvent implements DomainEvent {
  public readonly occurredOn: Date;
  public readonly eventName: string = 'gdi.created';

  constructor(public readonly gdi: Gdi) {
    this.occurredOn = new Date();
  }
}
