import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  IMeetingSeriesRepository,
  MEETING_SERIES_REPOSITORY,
} from '../../../domain/repositories/meeting-series.repository.interface';
import { MeetingSeries } from '../../../domain/meeting-series.aggregate';
import { UpdateMeetingSeriesCommand } from '../../commands/update-meeting-series.command';
import { SeriesName } from '../../../domain/value-objects/series-name.vo';

@Injectable()
export class UpdateMeetingSeriesUseCase {
  constructor(
    @Inject(MEETING_SERIES_REPOSITORY)
    private readonly seriesRepository: IMeetingSeriesRepository,
  ) {}

  async execute(command: UpdateMeetingSeriesCommand): Promise<MeetingSeries> {
    const series = await this.seriesRepository.findById(command.id);
    if (!series) {
      throw new NotFoundException(`Meeting series with ID ${command.id} not found`);
    }

    if (command.name) {
      const name = SeriesName.create(command.name);
      series.updateName(name);
    }

    if (command.description !== undefined) {
      series.updateDescription(command.description);
    }

    if (command.defaultTime !== undefined) {
      series.updateDefaultTime(command.defaultTime);
    }

    if (command.defaultLocation !== undefined) {
      series.updateDefaultLocation(command.defaultLocation);
    }

    if (command.endDate !== undefined) {
      series.updateEndDate(command.endDate);
    }

    if (command.audienceType !== undefined) {
      series.updateAudienceType(command.audienceType, command.audienceConfig);
    }

    return this.seriesRepository.save(series);
  }
}
