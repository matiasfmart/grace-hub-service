/**
 * Base class for all domain exceptions
 * Domain layer should never throw framework-specific exceptions
 */
export abstract class DomainException extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class EntityNotFoundException extends DomainException {
  constructor(entityName: string, id: string | number) {
    super(`${entityName} with id ${id} not found`);
  }
}

export class ValidationException extends DomainException {
  constructor(message: string) {
    super(message);
  }
}

export class BusinessRuleViolationException extends DomainException {
  constructor(message: string) {
    super(message);
  }
}
