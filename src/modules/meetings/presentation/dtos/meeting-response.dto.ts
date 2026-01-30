import { Meeting } from '../../domain/meeting.aggregate';
import { MeetingType } from '../../../../core/common/constants/status.constants';

export class MeetingResponseDto {
  meetingId: number;
  seriesName: string;
  date: string;  // YYYY-MM-DD for DATE column
  type: MeetingType;
  createdAt: string;  // ISO for TIMESTAMP
  updatedAt: string;  // ISO for TIMESTAMP

  static fromDomain(meeting: Meeting): MeetingResponseDto {
    const dto = new MeetingResponseDto();
    dto.meetingId = meeting.id!;
    dto.seriesName = meeting.seriesName.value;
    // DATE column: YYYY-MM-DD format
    dto.date = meeting.date.toISOString().split('T')[0];
    dto.type = meeting.type;
    // TIMESTAMP columns: Full ISO format
    dto.createdAt = meeting.createdAt!.toISOString();
    dto.updatedAt = meeting.updatedAt!.toISOString();
    return dto;
  }

  static fromDomainArray(meetings: Meeting[]): MeetingResponseDto[] {
    return meetings.map((meeting) => this.fromDomain(meeting));
  }
}
