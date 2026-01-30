import { Attendance } from '../../domain/attendance.aggregate';

export class AttendanceResponseDto {
  attendanceId: number;
  meetingId: number;
  memberId: number;
  wasPresent: boolean;
  createdAt: string;  // ISO string for TIMESTAMP
  updatedAt: string;  // ISO string for TIMESTAMP

  static fromDomain(attendance: Attendance): AttendanceResponseDto {
    const dto = new AttendanceResponseDto();
    dto.attendanceId = attendance.id!;
    dto.meetingId = attendance.meetingId;
    dto.memberId = attendance.memberId;
    dto.wasPresent = attendance.wasPresent;
    dto.createdAt = attendance.createdAt!.toISOString();
    dto.updatedAt = attendance.updatedAt!.toISOString();
    return dto;
  }

  static fromDomainArray(attendances: Attendance[]): AttendanceResponseDto[] {
    return attendances.map((attendance) => this.fromDomain(attendance));
  }
}
