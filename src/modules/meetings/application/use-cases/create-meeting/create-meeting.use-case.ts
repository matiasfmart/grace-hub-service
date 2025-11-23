import { Inject, Injectable } from '@nestjs/common';
import {
  IMeetingRepository,
  MEETING_REPOSITORY,
} from '../../../domain/repositories/meeting.repository.interface';
import { Meeting } from '../../../domain/meeting.aggregate';
import { SeriesName } from '../../../domain/value-objects/series-name.vo';
import { CreateMeetingCommand } from '../../commands/create-meeting.command';

@Injectable()
export class CreateMeetingUseCase {
  constructor(
    @Inject(MEETING_REPOSITORY)
    private readonly meetingRepository: IMeetingRepository,
  ) {}

  async execute(command: CreateMeetingCommand): Promise<Meeting> {
    const seriesName = SeriesName.create(command.seriesName);
    const meeting = Meeting.create(seriesName, command.date, command.type);
    const savedMeeting = await this.meetingRepository.save(meeting);
    savedMeeting.clearEvents();
    return savedMeeting;
  }
}
