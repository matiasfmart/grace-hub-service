import { MeetingSeries } from '../meeting-series.aggregate';
import { AudienceType } from '../../../../core/common/constants/status.constants';

export interface IMeetingSeriesRepository {
  save(series: MeetingSeries): Promise<MeetingSeries>;
  findAll(): Promise<MeetingSeries[]>;
  findById(id: number): Promise<MeetingSeries | null>;
  findByGdiId(gdiId: number): Promise<MeetingSeries[]>;
  findByAreaId(areaId: number): Promise<MeetingSeries[]>;
  findByAudienceType(audienceType: AudienceType): Promise<MeetingSeries[]>;
  delete(id: number): Promise<void>;
  exists(id: number): Promise<boolean>;
}

export const MEETING_SERIES_REPOSITORY = Symbol('MEETING_SERIES_REPOSITORY');
