import {
  Controller,
  Get,
  Post,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AttendanceApplicationService } from '../../application/services/attendance-application.service';
import { CreateAttendanceDto } from '../dtos/create-attendance.dto';
import { AttendanceResponseDto } from '../dtos/attendance-response.dto';
import { CreateAttendanceCommand } from '../../application/commands/create-attendance.command';

@Controller('attendance')
export class AttendanceController {
  constructor(
    private readonly attendanceApplicationService: AttendanceApplicationService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateAttendanceDto): Promise<AttendanceResponseDto> {
    const command = new CreateAttendanceCommand(
      dto.meetingId,
      dto.memberId,
      dto.wasPresent,
    );
    const attendance = await this.attendanceApplicationService.createAttendance(command);
    return AttendanceResponseDto.fromDomain(attendance);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(): Promise<AttendanceResponseDto[]> {
    const attendances = await this.attendanceApplicationService.getAllAttendances();
    return AttendanceResponseDto.fromDomainArray(attendances);
  }
}
