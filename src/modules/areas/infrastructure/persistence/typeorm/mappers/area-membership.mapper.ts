import { AreaMembership } from '../../../../domain/area-membership.aggregate';
import { AreaMembershipEntity } from '../area-membership.typeorm.entity';

/**
 * Mapper for Area Membership Aggregate
 *
 * Translates between Domain and Persistence layers
 */
export class AreaMembershipMapper {
  /**
   * Domain → Persistence
   */
  public static toPersistence(domain: AreaMembership): AreaMembershipEntity {
    const entity = new AreaMembershipEntity();

    if (domain.id) {
      entity.areaMembershipId = domain.id;
    }

    entity.areaId = domain.areaId;
    entity.memberId = domain.memberId;

    return entity;
  }

  /**
   * Persistence → Domain
   */
  public static toDomain(entity: AreaMembershipEntity): AreaMembership {
    return AreaMembership.reconstitute(
      entity.areaMembershipId,
      entity.areaId,
      entity.memberId,
    );
  }

  /**
   * Persistence[] → Domain[]
   */
  public static toDomainArray(entities: AreaMembershipEntity[]): AreaMembership[] {
    return entities.map((entity) => this.toDomain(entity));
  }
}
