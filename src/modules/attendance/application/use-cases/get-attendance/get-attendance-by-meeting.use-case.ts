import { Inject, Injectable } from '@nestjs/common';
import {
  IAttendanceRepository,
  ATTENDANCE_REPOSITORY,
} from '../../../domain/repositories/attendance.repository.interface';
import { Attendance } from '../../../domain/attendance.aggregate';

/**
 * Use Case: Get Attendance By Meeting
 *
 * Returns all attendance records for a specific meeting
 */
@Injectable()
export class GetAttendanceByMeetingUseCase {
  constructor(
    @Inject(ATTENDANCE_REPOSITORY)
    private readonly attendanceRepository: IAttendanceRepository,
  ) {}

  async execute(meetingId: number): Promise<Attendance[]> {
    return await this.attendanceRepository.findByMeeting(meetingId);
  }
}
