import { Area } from '../../../../domain/area.aggregate';
import { AreaName } from '../../../../domain/value-objects/area-name.vo';
import { AreaEntity } from '../area.typeorm.entity';

export class AreaMapper {
  public static toPersistence(domain: Area): AreaEntity {
    const entity = new AreaEntity();

    if (domain.id) {
      entity.areaId = domain.id;
    }

    entity.name = domain.name.value;
    entity.leaderId = domain.leaderId;
    entity.mentorId = domain.mentorId;

    if (domain.createdAt) {
      entity.createdAt = domain.createdAt;
    }
    if (domain.updatedAt) {
      entity.updatedAt = domain.updatedAt;
    }

    return entity;
  }

  public static toDomain(entity: AreaEntity): Area {
    const name = AreaName.create(entity.name);

    return Area.reconstitute(
      entity.areaId,
      name,
      undefined, // description - not stored in DB
      entity.leaderId,
      entity.mentorId,
      entity.createdAt,
      entity.updatedAt,
    );
  }

  public static toDomainArray(entities: AreaEntity[]): Area[] {
    return entities.map((entity) => this.toDomain(entity));
  }
}
