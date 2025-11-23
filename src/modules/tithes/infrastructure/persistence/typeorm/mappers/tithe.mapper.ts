import { Tithe } from '../../../../domain/tithe.aggregate';
import { TitheEntity } from '../tithe.typeorm.entity';

export class TitheMapper {
  public static toPersistence(domain: Tithe): TitheEntity {
    const entity = new TitheEntity();
    if (domain.id) {
      entity.titheId = domain.id;
    }
    entity.memberId = domain.memberId;
    entity.year = domain.year;
    entity.month = domain.month;
    if (domain.createdAt) {
      entity.createdAt = domain.createdAt;
    }
    if (domain.updatedAt) {
      entity.updatedAt = domain.updatedAt;
    }
    return entity;
  }

  public static toDomain(entity: TitheEntity): Tithe {
    return Tithe.reconstitute(
      entity.titheId,
      entity.memberId,
      entity.year,
      entity.month,
      entity.createdAt,
      entity.updatedAt,
    );
  }

  public static toDomainArray(entities: TitheEntity[]): Tithe[] {
    return entities.map((entity) => this.toDomain(entity));
  }
}
