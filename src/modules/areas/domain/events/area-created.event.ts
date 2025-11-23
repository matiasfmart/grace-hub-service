import { DomainEvent } from '../../../../core/domain/base/domain-event';
import { Area } from '../area.aggregate';

/**
 * Domain Event: Area Created
 *
 * Published when a new Area is created
 */
export class AreaCreatedEvent implements DomainEvent {
  public readonly occurredOn: Date;
  public readonly eventName: string = 'area.created';

  constructor(public readonly area: Area) {
    this.occurredOn = new Date();
  }
}
