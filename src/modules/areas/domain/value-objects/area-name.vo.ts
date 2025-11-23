import { ValueObject } from '../../../../core/domain/base/value-object';
import { ValidationException } from '../../../../core/domain/exceptions/domain.exception';

interface AreaNameProps {
  value: string;
}

/**
 * Value Object: Area Name
 */
export class AreaName extends ValueObject<AreaNameProps> {
  private constructor(props: AreaNameProps) {
    super(props);
  }

  public static create(name: string): AreaName {
    if (!name || name.trim().length === 0) {
      throw new ValidationException('Area name cannot be empty');
    }

    if (name.length > 255) {
      throw new ValidationException('Area name cannot exceed 255 characters');
    }

    return new AreaName({ value: name.trim() });
  }

  get value(): string {
    return this.props.value;
  }
}
