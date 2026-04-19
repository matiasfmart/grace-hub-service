import { MeetingSeries } from '../../domain/meeting-series.aggregate';
import { MeetingFrequency, AudienceType, DayOfWeek, MonthlyRuleType, WeekOrdinal } from '../../../../core/common/constants/status.constants';
import { AudienceConfig } from '../../domain/services/expected-attendees.query-service.interface';

export class MeetingSeriesResponseDto {
  seriesId: number;
  name: string;
  description?: string;
  audienceType: AudienceType;
  gdiId?: number;
  areaId?: number;
  meetingTypeId?: number;
  audienceConfig?: AudienceConfig;
  frequency: MeetingFrequency;
  startDate: string;
  endDate?: string;
  defaultTime?: string;
  defaultLocation?: string;
  oneTimeDate?: string;
  weeklyDays?: DayOfWeek[];
  monthlyRuleType?: MonthlyRuleType;
  monthlyDayOfMonth?: number;
  monthlyWeekOrdinal?: WeekOrdinal;
  monthlyDayOfWeek?: DayOfWeek;
  cancelledDates: string[];
  createdAt: string;
  updatedAt: string;

  static fromDomain(series: MeetingSeries): MeetingSeriesResponseDto {
    const dto = new MeetingSeriesResponseDto();
    dto.seriesId = series.id!;
    dto.name = series.name.value;
    dto.description = series.description || undefined;
    dto.audienceType = series.audienceType;
    dto.gdiId = series.gdiId || undefined;
    dto.areaId = series.areaId || undefined;
    dto.meetingTypeId = series.meetingTypeId || undefined;
    dto.audienceConfig = series.audienceConfig || undefined;
    dto.frequency = series.frequency;
    dto.startDate = series.startDate.toISOString().split('T')[0];
    dto.endDate = series.endDate?.toISOString().split('T')[0];
    dto.defaultTime = series.defaultTime || undefined;
    dto.defaultLocation = series.defaultLocation || undefined;
    dto.oneTimeDate = series.oneTimeDate?.toISOString().split('T')[0];
    dto.weeklyDays = series.weeklyDays || undefined;
    dto.monthlyRuleType = series.monthlyRuleType || undefined;
    dto.monthlyDayOfMonth = series.monthlyDayOfMonth || undefined;
    dto.monthlyWeekOrdinal = series.monthlyWeekOrdinal || undefined;
    dto.monthlyDayOfWeek = series.monthlyDayOfWeek || undefined;
    dto.cancelledDates = series.cancelledDates.map(d => d.toISOString().split('T')[0]);
    dto.createdAt = series.createdAt!.toISOString();
    dto.updatedAt = series.updatedAt!.toISOString();
    return dto;
  }

  static fromDomainArray(seriesList: MeetingSeries[]): MeetingSeriesResponseDto[] {
    return seriesList.map((series) => this.fromDomain(series));
  }
}
