import { RoleType } from '../../../../domain/role-type.aggregate';
import { RoleTypeName } from '../../../../domain/value-objects/role-type-name.vo';
import { RoleTypeEntity } from '../role-type.typeorm.entity';

/**
 * Mapper: RoleType Domain <-> TypeORM Entity
 * 
 * Translates between the domain model and the persistence model.
 */
export class RoleTypeMapper {
  public static toPersistence(domain: RoleType): RoleTypeEntity {
    const entity = new RoleTypeEntity();
    if (domain.id) {
      entity.roleTypeId = domain.id;
    }
    entity.name = domain.name.value;
    if (domain.createdAt) {
      entity.createdAt = domain.createdAt;
    }
    return entity;
  }

  public static toDomain(entity: RoleTypeEntity): RoleType {
    const name = RoleTypeName.create(entity.name);
    return RoleType.reconstitute(
      entity.roleTypeId,
      name,
      entity.createdAt || new Date(),
    );
  }

  public static toDomainArray(entities: RoleTypeEntity[]): RoleType[] {
    return entities.map((entity) => this.toDomain(entity));
  }
}
