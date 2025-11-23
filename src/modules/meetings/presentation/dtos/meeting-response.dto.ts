import { Meeting } from '../../domain/meeting.aggregate';
import { MeetingType } from '../../../../core/common/constants';

export class MeetingResponseDto {
  meetingId: number;
  seriesName: string;
  date: Date;
  type: MeetingType;
  createdAt: Date;
  updatedAt: Date;

  static fromDomain(meeting: Meeting): MeetingResponseDto {
    const dto = new MeetingResponseDto();
    dto.meetingId = meeting.id!;
    dto.seriesName = meeting.seriesName.value;
    dto.date = meeting.date;
    dto.type = meeting.type;
    dto.createdAt = meeting.createdAt!;
    dto.updatedAt = meeting.updatedAt!;
    return dto;
  }

  static fromDomainArray(meetings: Meeting[]): MeetingResponseDto[] {
    return meetings.map((meeting) => this.fromDomain(meeting));
  }
}
