import { ValueObject } from '../../../../core/domain/base/value-object';
import { ValidationException } from '../../../../core/domain/exceptions/domain.exception';

interface RoleTypeNameProps {
  value: string;
}

/**
 * Value Object: Role Type Name
 * 
 * Represents a valid name for an ecclesiastical label (e.g., "Pastor", "Diácono")
 * 
 * Business Rules:
 * - Must be between 2 and 50 characters
 * - Cannot be empty or only whitespace
 */
export class RoleTypeName extends ValueObject<RoleTypeNameProps> {
  private constructor(props: RoleTypeNameProps) {
    super(props);
  }

  get value(): string {
    return this.props.value;
  }

  public static create(name: string): RoleTypeName {
    const trimmed = name?.trim();

    if (!trimmed || trimmed.length === 0) {
      throw new ValidationException('Role type name cannot be empty');
    }

    if (trimmed.length < 2) {
      throw new ValidationException('Role type name must be at least 2 characters');
    }

    if (trimmed.length > 50) {
      throw new ValidationException('Role type name cannot exceed 50 characters');
    }

    return new RoleTypeName({ value: trimmed });
  }

  public equals(other: RoleTypeName): boolean {
    return this.props.value.toLowerCase() === other.props.value.toLowerCase();
  }
}
