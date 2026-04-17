import { Meeting } from '../../../../domain/meeting.aggregate';
import { MeetingEntity } from '../meeting.typeorm.entity';

export class MeetingMapper {
  public static toPersistence(domain: Meeting): MeetingEntity {
    const entity = new MeetingEntity();
    if (domain.id) {
      entity.meetingId = domain.id;
    }
    entity.seriesId = domain.seriesId;
    entity.date = domain.date;
    entity.time = domain.time || undefined;
    entity.location = domain.location || undefined;
    entity.notes = domain.notes || undefined;
    if (domain.createdAt) {
      entity.createdAt = domain.createdAt;
    }
    if (domain.updatedAt) {
      entity.updatedAt = domain.updatedAt;
    }
    return entity;
  }

  public static toDomain(entity: MeetingEntity): Meeting {
    return Meeting.reconstitute(
      entity.meetingId,
      entity.seriesId,
      entity.date,
      entity.time || null,
      entity.location || null,
      entity.notes || null,
      entity.createdAt,
      entity.updatedAt,
    );
  }

  public static toDomainArray(entities: MeetingEntity[]): Meeting[] {
    return entities.map((entity) => this.toDomain(entity));
  }
}
