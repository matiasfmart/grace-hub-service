import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  IMeetingSeriesRepository,
  MEETING_SERIES_REPOSITORY,
} from '../../../domain/repositories/meeting-series.repository.interface';

@Injectable()
export class DeleteMeetingSeriesUseCase {
  constructor(
    @Inject(MEETING_SERIES_REPOSITORY)
    private readonly seriesRepository: IMeetingSeriesRepository,
  ) {}

  async execute(id: number): Promise<void> {
    const exists = await this.seriesRepository.exists(id);
    if (!exists) {
      throw new NotFoundException(`Meeting series with ID ${id} not found`);
    }
    await this.seriesRepository.delete(id);
  }
}
