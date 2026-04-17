import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  IMeetingRepository,
  MEETING_REPOSITORY,
} from '../../../domain/repositories/meeting.repository.interface';
import {
  IMeetingSeriesRepository,
  MEETING_SERIES_REPOSITORY,
} from '../../../domain/repositories/meeting-series.repository.interface';
import {
  IExpectedAttendeesQueryService,
  EXPECTED_ATTENDEES_QUERY_SERVICE,
  ExpectedAttendee,
} from '../../../domain/services/expected-attendees.query-service.interface';

/**
 * Use Case: Get Expected Attendees for a Meeting
 * 
 * Returns the list of members who are expected to attend a meeting
 * based on the meeting series' audienceType configuration.
 */
@Injectable()
export class GetExpectedAttendeesUseCase {
  constructor(
    @Inject(MEETING_REPOSITORY)
    private readonly meetingRepository: IMeetingRepository,
    @Inject(MEETING_SERIES_REPOSITORY)
    private readonly seriesRepository: IMeetingSeriesRepository,
    @Inject(EXPECTED_ATTENDEES_QUERY_SERVICE)
    private readonly expectedAttendeesService: IExpectedAttendeesQueryService,
  ) {}

  async execute(meetingId: number): Promise<ExpectedAttendee[]> {
    // 1. Get the meeting
    const meeting = await this.meetingRepository.findById(meetingId);
    if (!meeting) {
      throw new NotFoundException(`Meeting with ID ${meetingId} not found`);
    }

    // 2. Get the associated series
    const series = await this.seriesRepository.findById(meeting.seriesId);
    if (!series) {
      throw new NotFoundException(`Meeting series with ID ${meeting.seriesId} not found`);
    }

    // 3. Get expected attendees based on audience type
    return this.expectedAttendeesService.getExpectedAttendees(
      series.audienceType,
      series.gdiId,
      series.areaId,
      series.meetingTypeId,
    );
  }
}
