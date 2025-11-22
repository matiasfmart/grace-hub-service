import { ValueObject } from '../../../../core/domain/base/value-object';
import { ValidationException } from '../../../../core/domain/exceptions/domain.exception';

interface ContactInfoProps {
  value: string;
}

/**
 * Value Object for Contact Information (email or phone)
 */
export class ContactInfo extends ValueObject<ContactInfoProps> {
  get value(): string {
    return this.props.value;
  }

  private constructor(props: ContactInfoProps) {
    super(props);
  }

  public static create(contact?: string): ContactInfo | undefined {
    if (!contact) {
      return undefined;
    }

    const trimmed = contact.trim();

    if (trimmed.length > 255) {
      throw new ValidationException('Contact info cannot exceed 255 characters');
    }

    // Basic validation (can be enhanced)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\+?[\d\s-()]+$/;

    if (!emailRegex.test(trimmed) && !phoneRegex.test(trimmed)) {
      throw new ValidationException('Contact must be a valid email or phone number');
    }

    return new ContactInfo({ value: trimmed });
  }
}
