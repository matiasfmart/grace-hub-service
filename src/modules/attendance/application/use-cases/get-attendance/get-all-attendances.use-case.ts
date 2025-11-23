import { Inject, Injectable } from '@nestjs/common';
import {
  IAttendanceRepository,
  ATTENDANCE_REPOSITORY,
} from '../../../domain/repositories/attendance.repository.interface';
import { Attendance } from '../../../domain/attendance.aggregate';

@Injectable()
export class GetAllAttendancesUseCase {
  constructor(
    @Inject(ATTENDANCE_REPOSITORY)
    private readonly attendanceRepository: IAttendanceRepository,
  ) {}

  async execute(): Promise<Attendance[]> {
    return await this.attendanceRepository.findAll();
  }
}
