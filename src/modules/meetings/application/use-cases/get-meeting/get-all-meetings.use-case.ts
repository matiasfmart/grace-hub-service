import { Inject, Injectable } from '@nestjs/common';
import {
  IMeetingRepository,
  MEETING_REPOSITORY,
  MeetingFilters,
} from '../../../domain/repositories/meeting.repository.interface';
import { Meeting } from '../../../domain/meeting.aggregate';

@Injectable()
export class GetAllMeetingsUseCase {
  constructor(
    @Inject(MEETING_REPOSITORY)
    private readonly meetingRepository: IMeetingRepository,
  ) {}

  async execute(filters?: MeetingFilters): Promise<Meeting[]> {
    return await this.meetingRepository.findAll(filters);
  }
}
