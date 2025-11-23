import { DomainEvent } from '../../../../../core/domain/base/domain-event';
import { Tithe } from '../tithe.aggregate';

export class TitheRecordedEvent implements DomainEvent {
  public readonly occurredOn: Date;
  public readonly eventName: string = 'tithe.recorded';

  constructor(public readonly tithe: Tithe) {
    this.occurredOn = new Date();
  }
}
