import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  IMeetingSeriesRepository,
  MEETING_SERIES_REPOSITORY,
} from '../../../domain/repositories/meeting-series.repository.interface';
import { MeetingSeries } from '../../../domain/meeting-series.aggregate';
import { CancelSeriesDateCommand } from '../../commands/cancel-series-date.command';

@Injectable()
export class CancelSeriesDateUseCase {
  constructor(
    @Inject(MEETING_SERIES_REPOSITORY)
    private readonly seriesRepository: IMeetingSeriesRepository,
  ) {}

  async execute(command: CancelSeriesDateCommand): Promise<MeetingSeries> {
    const series = await this.seriesRepository.findById(command.seriesId);
    if (!series) {
      throw new NotFoundException(
        `Meeting series with ID ${command.seriesId} not found`,
      );
    }

    series.cancelDate(command.date);

    return this.seriesRepository.save(series);
  }
}
