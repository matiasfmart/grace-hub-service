import { Injectable } from '@nestjs/common';
import { CreateMeetingUseCase } from '../use-cases/create-meeting/create-meeting.use-case';
import { GetAllMeetingsUseCase } from '../use-cases/get-meeting/get-all-meetings.use-case';
import { GetMeetingByIdUseCase } from '../use-cases/get-meeting/get-meeting-by-id.use-case';
import { UpdateMeetingUseCase } from '../use-cases/update-meeting/update-meeting.use-case';
import { CreateMeetingCommand } from '../commands/create-meeting.command';
import { UpdateMeetingCommand } from '../commands/update-meeting.command';
import { Meeting } from '../../domain/meeting.aggregate';

@Injectable()
export class MeetingApplicationService {
  constructor(
    private readonly createMeetingUseCase: CreateMeetingUseCase,
    private readonly getAllMeetingsUseCase: GetAllMeetingsUseCase,
    private readonly getMeetingByIdUseCase: GetMeetingByIdUseCase,
    private readonly updateMeetingUseCase: UpdateMeetingUseCase,
  ) {}

  async createMeeting(command: CreateMeetingCommand): Promise<Meeting> {
    return await this.createMeetingUseCase.execute(command);
  }

  async getAllMeetings(): Promise<Meeting[]> {
    return await this.getAllMeetingsUseCase.execute();
  }

  async getMeetingById(id: number): Promise<Meeting> {
    return await this.getMeetingByIdUseCase.execute(id);
  }

  async updateMeeting(command: UpdateMeetingCommand): Promise<Meeting> {
    return await this.updateMeetingUseCase.execute(command);
  }
}
