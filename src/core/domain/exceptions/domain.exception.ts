export class DomainException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DomainException';
  }
}

export class ValidationException extends DomainException {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationException';
  }
}

export class BusinessRuleViolationException extends DomainException {
  constructor(message: string) {
    super(message);
    this.name = 'BusinessRuleViolationException';
  }
}

export class EntityNotFoundException extends DomainException {
  constructor(entityName: string, id: string | number) {
    super(`${entityName} with id ${id} not found`);
    this.name = 'EntityNotFoundException';
  }
}
