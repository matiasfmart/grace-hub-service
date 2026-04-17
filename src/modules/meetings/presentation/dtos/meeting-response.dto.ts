import { Meeting } from '../../domain/meeting.aggregate';

export class MeetingResponseDto {
  meetingId: number;
  seriesId: number;
  date: string;  // YYYY-MM-DD for DATE column
  time?: string;
  location?: string;
  notes?: string;
  createdAt: string;  // ISO for TIMESTAMP
  updatedAt: string;  // ISO for TIMESTAMP

  static fromDomain(meeting: Meeting): MeetingResponseDto {
    const dto = new MeetingResponseDto();
    dto.meetingId = meeting.id!;
    dto.seriesId = meeting.seriesId;
    // DATE column: YYYY-MM-DD format
    dto.date = meeting.date.toISOString().split('T')[0];
    dto.time = meeting.time || undefined;
    dto.location = meeting.location || undefined;
    dto.notes = meeting.notes || undefined;
    // TIMESTAMP columns: Full ISO format
    dto.createdAt = meeting.createdAt!.toISOString();
    dto.updatedAt = meeting.updatedAt!.toISOString();
    return dto;
  }

  static fromDomainArray(meetings: Meeting[]): MeetingResponseDto[] {
    return meetings.map((meeting) => this.fromDomain(meeting));
  }
}
