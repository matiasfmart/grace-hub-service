/**
 * Base interface for all domain events
 */
export interface DomainEvent {
  occurredOn: Date;
  eventName: string;
}
