import { AttendanceMeetingStats } from '../../domain/repositories/attendance.repository.interface';

export class AttendanceStatsResponseDto {
  meetingId: number;
  presentCount: number;
  absentCount: number;
  totalExpected: number;

  static fromReadModel(stats: AttendanceMeetingStats): AttendanceStatsResponseDto {
    const dto = new AttendanceStatsResponseDto();
    dto.meetingId = stats.meetingId;
    dto.presentCount = stats.presentCount;
    dto.absentCount = stats.absentCount;
    dto.totalExpected = stats.totalExpected;
    return dto;
  }

  static fromReadModelArray(stats: AttendanceMeetingStats[]): AttendanceStatsResponseDto[] {
    return stats.map((s) => this.fromReadModel(s));
  }
}
