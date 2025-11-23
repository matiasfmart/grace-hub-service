import { Attendance } from '../../../../domain/attendance.aggregate';
import { AttendanceEntity } from '../attendance.typeorm.entity';

export class AttendanceMapper {
  public static toPersistence(domain: Attendance): AttendanceEntity {
    const entity = new AttendanceEntity();
    if (domain.id) {
      entity.attendanceId = domain.id;
    }
    entity.meetingId = domain.meetingId;
    entity.memberId = domain.memberId;
    entity.wasPresent = domain.wasPresent;
    if (domain.createdAt) {
      entity.createdAt = domain.createdAt;
    }
    if (domain.updatedAt) {
      entity.updatedAt = domain.updatedAt;
    }
    return entity;
  }

  public static toDomain(entity: AttendanceEntity): Attendance {
    return Attendance.reconstitute(
      entity.attendanceId,
      entity.meetingId,
      entity.memberId,
      entity.wasPresent,
      entity.createdAt,
      entity.updatedAt,
    );
  }

  public static toDomainArray(entities: AttendanceEntity[]): Attendance[] {
    return entities.map((entity) => this.toDomain(entity));
  }
}
