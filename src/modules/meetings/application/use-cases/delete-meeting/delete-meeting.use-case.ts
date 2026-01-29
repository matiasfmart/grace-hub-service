import { Inject, Injectable } from '@nestjs/common';
import {
  IMeetingRepository,
  MEETING_REPOSITORY,
} from '../../../domain/repositories/meeting.repository.interface';
import { DeleteMeetingCommand } from '../../commands/delete-meeting.command';
import { EntityNotFoundException } from '../../../../../core/domain/exceptions/domain.exception';

/**
 * Use Case: Delete Meeting
 *
 * Application layer - orchestrates domain operations
 * Validates existence before deletion
 */
@Injectable()
export class DeleteMeetingUseCase {
  constructor(
    @Inject(MEETING_REPOSITORY)
    private readonly meetingRepository: IMeetingRepository,
  ) {}

  async execute(command: DeleteMeetingCommand): Promise<void> {
    // Verify Meeting exists
    const exists = await this.meetingRepository.exists(command.id);

    if (!exists) {
      throw new EntityNotFoundException('Meeting', command.id);
    }

    // Delete Meeting
    await this.meetingRepository.delete(command.id);
  }
}
