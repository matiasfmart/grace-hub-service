import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
} from '@nestjs/common';
import { AttendanceApplicationService } from '../../application/services/attendance-application.service';
import { CreateAttendanceDto } from '../dtos/create-attendance.dto';
import { SaveAttendanceForMeetingDto } from '../dtos/save-attendance-for-meeting.dto';
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
  async findAll(
    @Query('meetingId') meetingId?: string,
    @Query('memberId') memberId?: string,
  ): Promise<AttendanceResponseDto[]> {
    // Filter by meeting
    if (meetingId) {
      const attendances = await this.attendanceApplicationService.getAttendanceByMeeting(
        parseInt(meetingId, 10),
      );
      return AttendanceResponseDto.fromDomainArray(attendances);
    }

    // Filter by member
    if (memberId) {
      const attendances = await this.attendanceApplicationService.getAttendanceByMember(
        parseInt(memberId, 10),
      );
      return AttendanceResponseDto.fromDomainArray(attendances);
    }

    // Return all
    const attendances = await this.attendanceApplicationService.getAllAttendances();
    return AttendanceResponseDto.fromDomainArray(attendances);
  }

  @Post('meeting/:meetingId')
  @HttpCode(HttpStatus.OK)
  async saveForMeeting(
    @Param('meetingId', ParseIntPipe) meetingId: number,
    @Body() dto: SaveAttendanceForMeetingDto,
  ): Promise<AttendanceResponseDto[]> {
    const attendances = await this.attendanceApplicationService.saveAttendanceForMeeting(
      meetingId,
      dto.attendances,
    );
    return AttendanceResponseDto.fromDomainArray(attendances);
  }
}
