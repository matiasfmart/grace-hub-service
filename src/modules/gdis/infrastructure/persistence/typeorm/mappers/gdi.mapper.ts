import { Gdi } from '../../../../domain/gdi.aggregate';
import { GdiName } from '../../../../domain/value-objects/gdi-name.vo';
import { GdiEntity } from '../gdi.typeorm.entity';

/**
 * Mapper: Domain <-> Infrastructure
 *
 * Anti-Corruption Layer between domain and database
 */
export class GdiMapper {
  /**
   * Maps Domain Aggregate to TypeORM Entity
   */
  public static toPersistence(domain: Gdi): GdiEntity {
    const entity = new GdiEntity();

    if (domain.id) {
      entity.gdiId = domain.id;
    }

    entity.name = domain.name.value;
    entity.guideId = domain.guideId;
    entity.mentorId = domain.mentorId;

    if (domain.createdAt) {
      entity.createdAt = domain.createdAt;
    }
    if (domain.updatedAt) {
      entity.updatedAt = domain.updatedAt;
    }

    return entity;
  }

  /**
   * Maps TypeORM Entity to Domain Aggregate
   */
  public static toDomain(entity: GdiEntity): Gdi {
    const name = GdiName.create(entity.name);

    return Gdi.reconstitute(
      entity.gdiId,
      name,
      entity.guideId,
      entity.mentorId,
      entity.createdAt,
      entity.updatedAt,
    );
  }

  /**
   * Maps array of entities to domain aggregates
   */
  public static toDomainArray(entities: GdiEntity[]): Gdi[] {
    return entities.map((entity) => this.toDomain(entity));
  }
}
