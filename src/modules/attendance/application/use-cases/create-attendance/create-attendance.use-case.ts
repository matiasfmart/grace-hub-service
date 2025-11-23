import { Inject, Injectable } from '@nestjs/common';
import {
  IAttendanceRepository,
  ATTENDANCE_REPOSITORY,
} from '../../../domain/repositories/attendance.repository.interface';
import { Attendance } from '../../../domain/attendance.aggregate';
import { CreateAttendanceCommand } from '../../commands/create-attendance.command';

@Injectable()
export class CreateAttendanceUseCase {
  constructor(
    @Inject(ATTENDANCE_REPOSITORY)
    private readonly attendanceRepository: IAttendanceRepository,
  ) {}

  async execute(command: CreateAttendanceCommand): Promise<Attendance> {
    const attendance = Attendance.create(
      command.meetingId,
      command.memberId,
      command.wasPresent,
    );
    const savedAttendance = await this.attendanceRepository.save(attendance);
    savedAttendance.clearEvents();
    return savedAttendance;
  }
}
