import { Member } from '../../../../domain/member.aggregate';
import { MemberEntity } from '../member.typeorm.entity';
import { MemberName } from '../../../../domain/value-objects/member-name.vo';
import { ContactInfo } from '../../../../domain/value-objects/contact-info.vo';
import { RecordStatus } from '../../../../../../core/common/constants/status.constants';

/**
 * Mapper between Domain Aggregate and Infrastructure Entity
 * Maintains separation of concerns between layers
 * 
 * Note: Read Model mapping is done directly in the repository
 * since it doesn't go through the aggregate.
 */
export class MemberMapper {
  /**
   * Convert Domain Aggregate to TypeORM Entity
   */
  public static toPersistence(member: Member): MemberEntity {
    const entity = new MemberEntity();

    if (member.id) {
      entity.memberId = member.id;
    }

    entity.firstName = member.name.firstName;
    entity.lastName = member.name.lastName;
    entity.contact = member.contact?.value;
    entity.recordStatus = member.recordStatus;
    entity.birthDate = member.birthDate;
    entity.baptismDate = member.baptismDate;
    entity.joinDate = member.joinDate;
    entity.bibleStudy = member.bibleStudy;
    entity.typeBibleStudy = member.typeBibleStudy;
    entity.address = member.address;
    entity.createdAt = member.createdAt;
    entity.updatedAt = member.updatedAt;

    return entity;
  }

  /**
   * Convert TypeORM Entity to Domain Aggregate
   */
  public static toDomain(entity: MemberEntity): Member {
    const name = MemberName.create(entity.firstName, entity.lastName);
    const contact = entity.contact ? ContactInfo.create(entity.contact) : undefined;

    return Member.reconstitute(
      entity.memberId,
      name,
      contact,
      entity.recordStatus as RecordStatus,
      entity.birthDate ?? undefined,
      entity.baptismDate ?? undefined,
      entity.joinDate ?? undefined,
      entity.bibleStudy,
      entity.typeBibleStudy,
      entity.address,
      entity.createdAt,
      entity.updatedAt,
    );
  }

  public static toDomainArray(entities: MemberEntity[]): Member[] {
    return entities.map(entity => this.toDomain(entity));
  }
}
