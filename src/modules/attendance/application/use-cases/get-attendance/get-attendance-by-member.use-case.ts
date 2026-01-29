import { Inject, Injectable } from '@nestjs/common';
import {
  IAttendanceRepository,
  ATTENDANCE_REPOSITORY,
} from '../../../domain/repositories/attendance.repository.interface';
import { Attendance } from '../../../domain/attendance.aggregate';

/**
 * Use Case: Get Attendance By Member
 *
 * Returns all attendance records for a specific member
 */
@Injectable()
export class GetAttendanceByMemberUseCase {
  constructor(
    @Inject(ATTENDANCE_REPOSITORY)
    private readonly attendanceRepository: IAttendanceRepository,
  ) {}

  async execute(memberId: number): Promise<Attendance[]> {
    return await this.attendanceRepository.findByMember(memberId);
  }
}
