import { Inject, Injectable } from '@nestjs/common';
import {
  IAttendanceRepository,
  ATTENDANCE_REPOSITORY,
} from '../../../domain/repositories/attendance.repository.interface';
import { Attendance } from '../../../domain/attendance.aggregate';

export interface AttendanceBatchItem {
  memberId: number;
  wasPresent: boolean;
}

/**
 * Use Case: Save Attendance For Meeting
 *
 * Saves or updates attendance records for all members in a meeting
 * Uses upsert logic: updates if exists, creates if not
 */
@Injectable()
export class SaveAttendanceForMeetingUseCase {
  constructor(
    @Inject(ATTENDANCE_REPOSITORY)
    private readonly attendanceRepository: IAttendanceRepository,
  ) {}

  async execute(meetingId: number, items: AttendanceBatchItem[]): Promise<Attendance[]> {
    const results: Attendance[] = [];

    for (const item of items) {
      // Check if attendance record already exists
      const existing = await this.attendanceRepository.findByMeetingAndMember(
        meetingId,
        item.memberId,
      );

      if (existing) {
        // Update existing record
        existing.updatePresence(item.wasPresent);
        const updated = await this.attendanceRepository.save(existing);
        results.push(updated);
      } else {
        // Create new record
        const newAttendance = Attendance.create(
          meetingId,
          item.memberId,
          item.wasPresent,
        );
        const saved = await this.attendanceRepository.save(newAttendance);
        results.push(saved);
      }
    }

    return results;
  }
}
