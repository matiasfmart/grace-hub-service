import { Inject, Injectable } from '@nestjs/common';
import {
  IMeetingRepository,
  MEETING_REPOSITORY,
} from '../../../domain/repositories/meeting.repository.interface';
import { Meeting } from '../../../domain/meeting.aggregate';
import { EntityNotFoundException } from '../../../../../core/domain/exceptions/domain.exception';

@Injectable()
export class GetMeetingByIdUseCase {
  constructor(
    @Inject(MEETING_REPOSITORY)
    private readonly meetingRepository: IMeetingRepository,
  ) {}

  async execute(id: number): Promise<Meeting> {
    const meeting = await this.meetingRepository.findById(id);
    if (!meeting) {
      throw new EntityNotFoundException('Meeting', id);
    }
    return meeting;
  }
}
