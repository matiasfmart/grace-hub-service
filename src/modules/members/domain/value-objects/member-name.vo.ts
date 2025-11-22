import { ValueObject } from '../../../../core/domain/base/value-object';
import { ValidationException } from '../../../../core/domain/exceptions/domain.exception';

interface MemberNameProps {
  firstName: string;
  lastName: string;
}

/**
 * Value Object for Member Name
 * Ensures name validation rules are always enforced
 */
export class MemberName extends ValueObject<MemberNameProps> {
  get firstName(): string {
    return this.props.firstName;
  }

  get lastName(): string {
    return this.props.lastName;
  }

  get fullName(): string {
    return `${this.props.firstName} ${this.props.lastName}`;
  }

  private constructor(props: MemberNameProps) {
    super(props);
  }

  public static create(firstName: string, lastName: string): MemberName {
    if (!firstName || firstName.trim().length === 0) {
      throw new ValidationException('First name cannot be empty');
    }

    if (!lastName || lastName.trim().length === 0) {
      throw new ValidationException('Last name cannot be empty');
    }

    if (firstName.length > 100) {
      throw new ValidationException('First name cannot exceed 100 characters');
    }

    if (lastName.length > 100) {
      throw new ValidationException('Last name cannot exceed 100 characters');
    }

    return new MemberName({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
    });
  }
}
