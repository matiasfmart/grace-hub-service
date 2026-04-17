import { Inject, Injectable } from '@nestjs/common';
import {
  IMeetingSeriesRepository,
  MEETING_SERIES_REPOSITORY,
} from '../../../domain/repositories/meeting-series.repository.interface';
import { MeetingSeries } from '../../../domain/meeting-series.aggregate';
import { AudienceType } from '../../../../../core/common/constants/status.constants';

export interface GetAllMeetingSeriesFilters {
  gdiId?: number;
  areaId?: number;
  audienceType?: AudienceType;
}

@Injectable()
export class GetAllMeetingSeriesUseCase {
  constructor(
    @Inject(MEETING_SERIES_REPOSITORY)
    private readonly seriesRepository: IMeetingSeriesRepository,
  ) {}

  async execute(filters?: GetAllMeetingSeriesFilters): Promise<MeetingSeries[]> {
    if (filters?.gdiId) {
      return this.seriesRepository.findByGdiId(filters.gdiId);
    }
    if (filters?.areaId) {
      return this.seriesRepository.findByAreaId(filters.areaId);
    }
    if (filters?.audienceType) {
      return this.seriesRepository.findByAudienceType(filters.audienceType);
    }
    return this.seriesRepository.findAll();
  }
}
