import { Meeting } from '../meeting.aggregate';

export interface MeetingFilters {
  seriesId?: number;
  startDate?: Date;
  endDate?: Date;
}

/**
 * Read model for aggregated meeting count per series.
 * Used by GET /meetings/count-by-series — avoids fetching all rows.
 */
export interface MeetingSeriesCount {
  seriesId: number;
  count: number;
}

export interface IMeetingRepository {
  save(meeting: Meeting): Promise<Meeting>;
  findById(id: number): Promise<Meeting | null>;
  findAll(filters?: MeetingFilters): Promise<Meeting[]>;
  findBySeriesId(seriesId: number): Promise<Meeting[]>;
  delete(id: number): Promise<void>;
  exists(id: number): Promise<boolean>;
  countBySeries(): Promise<MeetingSeriesCount[]>;
}

export const MEETING_REPOSITORY = Symbol('MEETING_REPOSITORY');
