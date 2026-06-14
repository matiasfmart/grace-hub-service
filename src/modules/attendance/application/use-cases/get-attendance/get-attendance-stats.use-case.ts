import { Inject, Injectable } from '@nestjs/common';
import {
  IAttendanceRepository,
  AttendanceMeetingStats,
  ATTENDANCE_REPOSITORY,
} from '../../../domain/repositories/attendance.repository.interface';

@Injectable()
export class GetAttendanceStatsUseCase {
  constructor(
    @Inject(ATTENDANCE_REPOSITORY)
    private readonly attendanceRepository: IAttendanceRepository,
  ) {}

  async execute(meetingIds: number[]): Promise<AttendanceMeetingStats[]> {
    return this.attendanceRepository.findStatsByMeetings(meetingIds);
  }
}
