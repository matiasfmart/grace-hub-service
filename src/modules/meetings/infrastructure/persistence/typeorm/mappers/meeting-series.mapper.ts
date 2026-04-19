import { MeetingSeries } from '../../../../domain/meeting-series.aggregate';
import { SeriesName } from '../../../../domain/value-objects/series-name.vo';
import { MeetingSeriesEntity } from '../meeting-series.typeorm.entity';
import { DayOfWeek } from '../../../../../../core/common/constants/status.constants';
import { AudienceConfig } from '../../../../domain/services/expected-attendees.query-service.interface';

export class MeetingSeriesMapper {
  public static toPersistence(domain: MeetingSeries): MeetingSeriesEntity {
    const entity = new MeetingSeriesEntity();
    if (domain.id) {
      entity.seriesId = domain.id;
    }
    entity.name = domain.name.value;
    entity.description = domain.description || undefined;
    entity.audienceType = domain.audienceType;
    entity.gdiId = domain.gdiId || undefined;
    entity.areaId = domain.areaId || undefined;
    entity.meetingTypeId = domain.meetingTypeId || undefined;
    entity.audienceConfig = domain.audienceConfig || undefined;
    entity.frequency = domain.frequency;
    entity.startDate = domain.startDate;
    entity.endDate = domain.endDate || undefined;
    entity.defaultTime = domain.defaultTime || undefined;
    entity.defaultLocation = domain.defaultLocation || undefined;
    entity.oneTimeDate = domain.oneTimeDate || undefined;
    // Convert DayOfWeek[] to string[] for storage
    entity.weeklyDays = domain.weeklyDays?.map(d => d as string) || undefined;
    entity.monthlyRuleType = domain.monthlyRuleType || undefined;
    entity.monthlyDayOfMonth = domain.monthlyDayOfMonth || undefined;
    entity.monthlyWeekOrdinal = domain.monthlyWeekOrdinal || undefined;
    entity.monthlyDayOfWeek = domain.monthlyDayOfWeek || undefined;
    entity.cancelledDates = domain.cancelledDates.length > 0 ? domain.cancelledDates : undefined;
    if (domain.createdAt) {
      entity.createdAt = domain.createdAt;
    }
    if (domain.updatedAt) {
      entity.updatedAt = domain.updatedAt;
    }
    return entity;
  }

  public static toDomain(entity: MeetingSeriesEntity): MeetingSeries {
    const name = SeriesName.create(entity.name);
    // Convert string[] back to DayOfWeek[]
    const weeklyDays = entity.weeklyDays?.map(d => d as DayOfWeek) || null;

    return MeetingSeries.reconstitute(
      entity.seriesId,
      name,
      entity.description || null,
      entity.audienceType,
      entity.gdiId || null,
      entity.areaId || null,
      entity.meetingTypeId || null,
      (entity.audienceConfig as AudienceConfig) || null,
      entity.frequency,
      entity.startDate,
      entity.endDate || null,
      entity.defaultTime || null,
      entity.defaultLocation || null,
      entity.oneTimeDate || null,
      weeklyDays,
      entity.monthlyRuleType || null,
      entity.monthlyDayOfMonth || null,
      entity.monthlyWeekOrdinal || null,
      entity.monthlyDayOfWeek || null,
      entity.createdAt,
      entity.updatedAt,
      entity.cancelledDates || [],
    );
  }

  public static toDomainArray(entities: MeetingSeriesEntity[]): MeetingSeries[] {
    return entities.map((entity) => this.toDomain(entity));
  }
}
