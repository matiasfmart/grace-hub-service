import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  IMeetingSeriesRepository,
  MEETING_SERIES_REPOSITORY,
} from '../../../domain/repositories/meeting-series.repository.interface';
import { MeetingSeries } from '../../../domain/meeting-series.aggregate';
import { RestoreSeriesDateCommand } from '../../commands/restore-series-date.command';

@Injectable()
export class RestoreSeriesDateUseCase {
  constructor(
    @Inject(MEETING_SERIES_REPOSITORY)
    private readonly seriesRepository: IMeetingSeriesRepository,
  ) {}

  async execute(command: RestoreSeriesDateCommand): Promise<MeetingSeries> {
    const series = await this.seriesRepository.findById(command.seriesId);
    if (!series) {
      throw new NotFoundException(
        `Meeting series with ID ${command.seriesId} not found`,
      );
    }

    series.restoreDate(command.date);

    return this.seriesRepository.save(series);
  }
}
