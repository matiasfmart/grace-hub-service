import { ExpectedAttendee } from '../../domain/services/expected-attendees.query-service.interface';

/**
 * Response DTO for expected attendees
 */
export class ExpectedAttendeeResponseDto {
  memberId: number;
  firstName: string;
  lastName: string;
  fullName: string;

  static fromDomain(attendee: ExpectedAttendee): ExpectedAttendeeResponseDto {
    const dto = new ExpectedAttendeeResponseDto();
    dto.memberId = attendee.memberId;
    dto.firstName = attendee.firstName;
    dto.lastName = attendee.lastName;
    dto.fullName = attendee.fullName;
    return dto;
  }

  static fromDomainArray(attendees: ExpectedAttendee[]): ExpectedAttendeeResponseDto[] {
    return attendees.map((a) => this.fromDomain(a));
  }
}
