import { MemberRole } from '../../../../domain/member-role.aggregate';
import { MemberRoleEntity } from '../member-role.typeorm.entity';

export class MemberRoleMapper {
  public static toPersistence(domain: MemberRole): MemberRoleEntity {
    const entity = new MemberRoleEntity();
    if (domain.id) {
      entity.roleId = domain.id;
    }
    entity.memberId = domain.memberId;
    entity.roleGeneral = domain.roleGeneral;
    if (domain.createdAt) {
      entity.createdAt = domain.createdAt;
    }
    if (domain.updatedAt) {
      entity.updatedAt = domain.updatedAt;
    }
    return entity;
  }

  public static toDomain(entity: MemberRoleEntity): MemberRole {
    return MemberRole.reconstitute(
      entity.roleId,
      entity.memberId,
      entity.roleGeneral,
      entity.createdAt,
      entity.updatedAt,
    );
  }

  public static toDomainArray(entities: MemberRoleEntity[]): MemberRole[] {
    return entities.map((entity) => this.toDomain(entity));
  }
}
