import { Injectable } from '@nestjs/common';
import { CreateAttendanceUseCase } from '../use-cases/create-attendance/create-attendance.use-case';
import { GetAllAttendancesUseCase } from '../use-cases/get-attendance/get-all-attendances.use-case';
import { CreateAttendanceCommand } from '../commands/create-attendance.command';
import { Attendance } from '../../domain/attendance.aggregate';

@Injectable()
export class AttendanceApplicationService {
  constructor(
    private readonly createAttendanceUseCase: CreateAttendanceUseCase,
    private readonly getAllAttendancesUseCase: GetAllAttendancesUseCase,
  ) {}

  async createAttendance(command: CreateAttendanceCommand): Promise<Attendance> {
    return await this.createAttendanceUseCase.execute(command);
  }

  async getAllAttendances(): Promise<Attendance[]> {
    return await this.getAllAttendancesUseCase.execute();
  }
}
