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
    // Note: Entity has leaderId/mentorId but aggregate has description
    // Using description as placeholder until schema is clarified
    entity.leaderId = undefined;
    entity.mentorId = undefined;

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
      undefined, // description - entity doesn't have this field
      entity.createdAt,
      entity.updatedAt,
    );
  }

  public static toDomainArray(entities: AreaEntity[]): Area[] {
    return entities.map((entity) => this.toDomain(entity));
  }
}
