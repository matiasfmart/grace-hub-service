import { ValueObject } from '../../../../../core/domain/base/value-object';
import { ValidationException } from '../../../../../core/domain/exceptions/domain.exception';

interface GdiNameProps {
  value: string;
}

/**
 * Value Object: GDI Name
 *
 * Encapsulates GDI name with validation rules
 */
export class GdiName extends ValueObject<GdiNameProps> {
  private constructor(props: GdiNameProps) {
    super(props);
  }

  public static create(name: string): GdiName {
    if (!name || name.trim().length === 0) {
      throw new ValidationException('GDI name cannot be empty');
    }

    if (name.length > 255) {
      throw new ValidationException('GDI name cannot exceed 255 characters');
    }

    return new GdiName({ value: name.trim() });
  }

  get value(): string {
    return this.props.value;
  }
}
