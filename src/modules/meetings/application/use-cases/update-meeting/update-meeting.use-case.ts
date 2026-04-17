import { Inject, Injectable } from '@nestjs/common';
import {
  IMeetingRepository,
  MEETING_REPOSITORY,
} from '../../../domain/repositories/meeting.repository.interface';
import { Meeting } from '../../../domain/meeting.aggregate';
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

    if (command.date) {
      meeting.updateDate(command.date);
    }

    if (command.time !== undefined) {
      meeting.updateTime(command.time);
    }

    if (command.location !== undefined) {
      meeting.updateLocation(command.location);
    }

    if (command.notes !== undefined) {
      meeting.updateNotes(command.notes);
    }

    const updatedMeeting = await this.meetingRepository.save(meeting);
    updatedMeeting.clearEvents();
    return updatedMeeting;
  }
}
