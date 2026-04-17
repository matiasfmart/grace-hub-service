import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  IMeetingSeriesRepository,
  MEETING_SERIES_REPOSITORY,
} from '../../../domain/repositories/meeting-series.repository.interface';
import { MeetingSeries } from '../../../domain/meeting-series.aggregate';

@Injectable()
export class GetMeetingSeriesByIdUseCase {
  constructor(
    @Inject(MEETING_SERIES_REPOSITORY)
    private readonly seriesRepository: IMeetingSeriesRepository,
  ) {}

  async execute(id: number): Promise<MeetingSeries> {
    const series = await this.seriesRepository.findById(id);
    if (!series) {
      throw new NotFoundException(`Meeting series with ID ${id} not found`);
    }
    return series;
  }
}
