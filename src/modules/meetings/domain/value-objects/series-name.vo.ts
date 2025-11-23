import { ValueObject } from '../../../../../core/domain/base/value-object';
import { ValidationException } from '../../../../../core/domain/exceptions/domain.exception';

interface SeriesNameProps {
  value: string;
}

export class SeriesName extends ValueObject<SeriesNameProps> {
  private constructor(props: SeriesNameProps) {
    super(props);
  }

  public static create(name: string): SeriesName {
    if (!name || name.trim().length === 0) {
      throw new ValidationException('Series name cannot be empty');
    }
    if (name.length > 255) {
      throw new ValidationException('Series name cannot exceed 255 characters');
    }
    return new SeriesName({ value: name.trim() });
  }

  get value(): string {
    return this.props.value;
  }
}
