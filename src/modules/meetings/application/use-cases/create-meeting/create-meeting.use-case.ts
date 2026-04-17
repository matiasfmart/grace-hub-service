import { Inject, Injectable } from '@nestjs/common';
import {
  IMeetingRepository,
  MEETING_REPOSITORY,
} from '../../../domain/repositories/meeting.repository.interface';
import { Meeting } from '../../../domain/meeting.aggregate';
import { CreateMeetingCommand } from '../../commands/create-meeting.command';

@Injectable()
export class CreateMeetingUseCase {
  constructor(
    @Inject(MEETING_REPOSITORY)
    private readonly meetingRepository: IMeetingRepository,
  ) {}

  async execute(command: CreateMeetingCommand): Promise<Meeting> {
    const meeting = Meeting.create(command.seriesId, command.date, {
      time: command.time,
      location: command.location,
      notes: command.notes,
    });
    const savedMeeting = await this.meetingRepository.save(meeting);
    savedMeeting.clearEvents();
    return savedMeeting;
  }
}
