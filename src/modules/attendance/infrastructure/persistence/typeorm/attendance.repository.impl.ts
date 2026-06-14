import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { AttendanceEntity } from './attendance.typeorm.entity';
import { IAttendanceRepository, AttendanceMeetingStats } from '../../../domain/repositories/attendance.repository.interface';
import { Attendance } from '../../../domain/attendance.aggregate';
import { BaseRepository } from '../../../../../core/database/postgresql/base.repository';
import { AttendanceMapper } from './mappers/attendance.mapper';

@Injectable()
export class AttendanceRepositoryImpl
  extends BaseRepository<AttendanceEntity>
  implements IAttendanceRepository
{
  constructor(
    @InjectRepository(AttendanceEntity)
    private readonly attendanceRepository: Repository<AttendanceEntity>,
    dataSource: DataSource,
  ) {
    super(attendanceRepository, dataSource);
  }

  async save(attendance: Attendance): Promise<Attendance> {
    const entity = AttendanceMapper.toPersistence(attendance);
    const savedEntity = await this.attendanceRepository.save(entity);
    return AttendanceMapper.toDomain(savedEntity);
  }

  async saveMany(attendances: Attendance[]): Promise<Attendance[]> {
    const entities = attendances.map(a => AttendanceMapper.toPersistence(a));
    const savedEntities = await this.attendanceRepository.save(entities);
    return AttendanceMapper.toDomainArray(savedEntities);
  }

  async findById(id: number): Promise<Attendance | null> {
    const entity = await this.attendanceRepository.findOne({
      where: { attendanceId: id },
    });
    return entity ? AttendanceMapper.toDomain(entity) : null;
  }

  async findAll(): Promise<Attendance[]> {
    const entities = await this.attendanceRepository.find();
    return AttendanceMapper.toDomainArray(entities);
  }

  async findByMeeting(meetingId: number): Promise<Attendance[]> {
    const entities = await this.attendanceRepository.find({
      where: { meetingId },
    });
    return AttendanceMapper.toDomainArray(entities);
  }

  async findByMember(memberId: number): Promise<Attendance[]> {
    const entities = await this.attendanceRepository.find({
      where: { memberId },
    });
    return AttendanceMapper.toDomainArray(entities);
  }

  async findByMeetingAndMember(meetingId: number, memberId: number): Promise<Attendance | null> {
    const entity = await this.attendanceRepository.findOne({
      where: { meetingId, memberId },
    });
    return entity ? AttendanceMapper.toDomain(entity) : null;
  }

  async delete(id: number): Promise<void> {
    await this.attendanceRepository.delete(id);
  }

  async deleteByMeeting(meetingId: number): Promise<void> {
    await this.attendanceRepository.delete({ meetingId });
  }

  async exists(id: number): Promise<boolean> {
    const count = await this.attendanceRepository.count({
      where: { attendanceId: id },
    });
    return count > 0;
  }

  async findStatsByMeetings(meetingIds: number[]): Promise<AttendanceMeetingStats[]> {
    if (meetingIds.length === 0) return [];
    const rows: Array<{
      meeting_id: string;
      present_count: string;
      absent_count: string;
      total_expected: string;
    }> = await this.attendanceRepository.query(
      `SELECT
         meeting_id,
         COUNT(*) FILTER (WHERE was_present = true)  AS present_count,
         COUNT(*) FILTER (WHERE was_present = false) AS absent_count,
         COUNT(*)                                    AS total_expected
       FROM attendance
       WHERE meeting_id = ANY($1::int[])
       GROUP BY meeting_id`,
      [meetingIds],
    );
    return rows.map((r) => ({
      meetingId: Number(r.meeting_id),
      presentCount: Number(r.present_count),
      absentCount: Number(r.absent_count),
      totalExpected: Number(r.total_expected),
    }));
  }
}
