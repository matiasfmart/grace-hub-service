import { Inject, Injectable } from '@nestjs/common';
import {
  IMeetingRepository,
  MeetingSeriesCount,
  MEETING_REPOSITORY,
} from '../../../domain/repositories/meeting.repository.interface';

@Injectable()
export class GetMeetingsCountBySeriesUseCase {
  constructor(
    @Inject(MEETING_REPOSITORY)
    private readonly meetingRepository: IMeetingRepository,
  ) {}

  async execute(): Promise<MeetingSeriesCount[]> {
    return this.meetingRepository.countBySeries();
  }
}
