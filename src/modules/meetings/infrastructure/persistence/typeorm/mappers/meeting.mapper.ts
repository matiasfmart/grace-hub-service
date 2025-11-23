import { Meeting } from '../../../../domain/meeting.aggregate';
import { SeriesName } from '../../../../domain/value-objects/series-name.vo';
import { MeetingEntity } from '../meeting.typeorm.entity';

export class MeetingMapper {
  public static toPersistence(domain: Meeting): MeetingEntity {
    const entity = new MeetingEntity();
    if (domain.id) {
      entity.meetingId = domain.id;
    }
    entity.seriesName = domain.seriesName.value;
    entity.date = domain.date;
    entity.type = domain.type;
    if (domain.createdAt) {
      entity.createdAt = domain.createdAt;
    }
    if (domain.updatedAt) {
      entity.updatedAt = domain.updatedAt;
    }
    return entity;
  }

  public static toDomain(entity: MeetingEntity): Meeting {
    const seriesName = SeriesName.create(entity.seriesName);
    return Meeting.reconstitute(
      entity.meetingId,
      seriesName,
      entity.date,
      entity.type,
      entity.createdAt,
      entity.updatedAt,
    );
  }

  public static toDomainArray(entities: MeetingEntity[]): Meeting[] {
    return entities.map((entity) => this.toDomain(entity));
  }
}
