import { Attendance } from '../../domain/attendance.aggregate';

export class AttendanceResponseDto {
  attendanceId: number;
  meetingId: number;
  memberId: number;
  wasPresent: boolean;
  createdAt: Date;
  updatedAt: Date;

  static fromDomain(attendance: Attendance): AttendanceResponseDto {
    const dto = new AttendanceResponseDto();
    dto.attendanceId = attendance.id!;
    dto.meetingId = attendance.meetingId;
    dto.memberId = attendance.memberId;
    dto.wasPresent = attendance.wasPresent;
    dto.createdAt = attendance.createdAt!;
    dto.updatedAt = attendance.updatedAt!;
    return dto;
  }

  static fromDomainArray(attendances: Attendance[]): AttendanceResponseDto[] {
    return attendances.map((attendance) => this.fromDomain(attendance));
  }
}
