import { GdiMembership } from '../../../../domain/gdi-membership.aggregate';
import { GdiMembershipEntity } from '../gdi-membership.typeorm.entity';

/**
 * Mapper for GDI Membership Aggregate
 *
 * Translates between Domain and Persistence layers
 */
export class GdiMembershipMapper {
  /**
   * Domain → Persistence
   */
  public static toPersistence(domain: GdiMembership): GdiMembershipEntity {
    const entity = new GdiMembershipEntity();

    if (domain.id) {
      entity.gdiMembershipId = domain.id;
    }

    entity.gdiId = domain.gdiId;
    entity.memberId = domain.memberId;

    return entity;
  }

  /**
   * Persistence → Domain
   */
  public static toDomain(entity: GdiMembershipEntity): GdiMembership {
    return GdiMembership.reconstitute(
      entity.gdiMembershipId,
      entity.gdiId,
      entity.memberId,
    );
  }

  /**
   * Persistence[] → Domain[]
   */
  public static toDomainArray(entities: GdiMembershipEntity[]): GdiMembership[] {
    return entities.map((entity) => this.toDomain(entity));
  }
}
