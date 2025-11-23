import { Inject, Injectable } from '@nestjs/common';
import {
  IMeetingRepository,
  MEETING_REPOSITORY,
} from '../../../domain/repositories/meeting.repository.interface';
import { Meeting } from '../../../domain/meeting.aggregate';
import { SeriesName } from '../../../domain/value-objects/series-name.vo';
import { UpdateMeetingCommand } from '../../commands/update-meeting.command';
import { EntityNotFoundException } from '../../../../../core/domain/exceptions/domain.exception';

@Injectable()
export class UpdateMeetingUseCase {
  constructor(
    @Inject(MEETING_REPOSITORY)
    private readonly meetingRepository: IMeetingRepository,
  ) {}

  async execute(command: UpdateMeetingCommand): Promise<Meeting> {
    const meeting = await this.meetingRepository.findById(command.id);
    if (!meeting) {
      throw new EntityNotFoundException('Meeting', command.id);
    }

    if (command.seriesName) {
      const newSeriesName = SeriesName.create(command.seriesName);
      meeting.updateSeriesName(newSeriesName);
    }

    if (command.date) {
      meeting.updateDate(command.date);
    }

    const updatedMeeting = await this.meetingRepository.save(meeting);
    updatedMeeting.clearEvents();
    return updatedMeeting;
  }
}
