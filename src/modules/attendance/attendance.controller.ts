import { Controller, Get, Post, Body, Param, Query, HttpCode, HttpStatus } from '@nestjs/common';

@Controller('attendance')
export class AttendanceController {
  @Get()
  async findAll(@Query('meetingId') meetingId?: number) {
    // TODO: Implementar GetAllAttendanceUseCase
    return { message: 'Get all attendance', meetingId };
  }

  @Get('meeting/:meetingId')
  async findByMeeting(@Param('meetingId') meetingId: string) {
    // TODO: Implementar GetAttendanceByMeetingUseCase
    return { message: `Get attendance for meeting ${meetingId}` };
  }

  @Post('upsert')
  @HttpCode(HttpStatus.OK)
  async upsert(@Body() upsertAttendanceDto: any) {
    // TODO: Implementar UpsertAttendanceUseCase con snapshots
    return { message: 'Upsert attendance', data: upsertAttendanceDto };
  }
}
