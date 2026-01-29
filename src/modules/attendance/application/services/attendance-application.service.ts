import { Injectable } from '@nestjs/common';
import { CreateAttendanceUseCase } from '../use-cases/create-attendance/create-attendance.use-case';
import { GetAllAttendancesUseCase } from '../use-cases/get-attendance/get-all-attendances.use-case';
import { GetAttendanceByMeetingUseCase } from '../use-cases/get-attendance/get-attendance-by-meeting.use-case';
import { GetAttendanceByMemberUseCase } from '../use-cases/get-attendance/get-attendance-by-member.use-case';
import { SaveAttendanceForMeetingUseCase, AttendanceBatchItem } from '../use-cases/save-attendance-for-meeting/save-attendance-for-meeting.use-case';
import { CreateAttendanceCommand } from '../commands/create-attendance.command';
import { Attendance } from '../../domain/attendance.aggregate';

@Injectable()
export class AttendanceApplicationService {
  constructor(
    private readonly createAttendanceUseCase: CreateAttendanceUseCase,
    private readonly getAllAttendancesUseCase: GetAllAttendancesUseCase,
    private readonly getAttendanceByMeetingUseCase: GetAttendanceByMeetingUseCase,
    private readonly getAttendanceByMemberUseCase: GetAttendanceByMemberUseCase,
    private readonly saveAttendanceForMeetingUseCase: SaveAttendanceForMeetingUseCase,
  ) {}

  async createAttendance(command: CreateAttendanceCommand): Promise<Attendance> {
    return await this.createAttendanceUseCase.execute(command);
  }

  async getAllAttendances(): Promise<Attendance[]> {
    return await this.getAllAttendancesUseCase.execute();
  }

  async getAttendanceByMeeting(meetingId: number): Promise<Attendance[]> {
    return await this.getAttendanceByMeetingUseCase.execute(meetingId);
  }

  async getAttendanceByMember(memberId: number): Promise<Attendance[]> {
    return await this.getAttendanceByMemberUseCase.execute(memberId);
  }

  async saveAttendanceForMeeting(meetingId: number, items: AttendanceBatchItem[]): Promise<Attendance[]> {
    return await this.saveAttendanceForMeetingUseCase.execute(meetingId, items);
  }
}
