import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
} from '@nestjs/common';
import { MeetingApplicationService } from '../../application/services/meeting-application.service';
import { GetExpectedAttendeesUseCase } from '../../application/use-cases/get-expected-attendees/get-expected-attendees.use-case';
import { CreateMeetingDto } from '../dtos/create-meeting.dto';
import { UpdateMeetingDto } from '../dtos/update-meeting.dto';
import { MeetingResponseDto } from '../dtos/meeting-response.dto';
import { ExpectedAttendeeResponseDto } from '../dtos/expected-attendee-response.dto';
import { CreateMeetingCommand } from '../../application/commands/create-meeting.command';
import { UpdateMeetingCommand } from '../../application/commands/update-meeting.command';
import { DeleteMeetingCommand } from '../../application/commands/delete-meeting.command';

@Controller('meetings')
export class MeetingsController {
  constructor(
    private readonly meetingApplicationService: MeetingApplicationService,
    private readonly getExpectedAttendeesUseCase: GetExpectedAttendeesUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateMeetingDto): Promise<MeetingResponseDto> {
    const command = new CreateMeetingCommand(
      dto.seriesId,
      new Date(dto.date),
      dto.time,
      dto.location,
      dto.notes,
    );
    const meeting = await this.meetingApplicationService.createMeeting(command);
    return MeetingResponseDto.fromDomain(meeting);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Query('seriesId') seriesId?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ): Promise<MeetingResponseDto[]> {
    const filters = {
      seriesId: seriesId ? parseInt(seriesId, 10) : undefined,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
    };
    const meetings = await this.meetingApplicationService.getAllMeetings(filters);
    return MeetingResponseDto.fromDomainArray(meetings);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<MeetingResponseDto> {
    const meeting = await this.meetingApplicationService.getMeetingById(id);
    return MeetingResponseDto.fromDomain(meeting);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateMeetingDto,
  ): Promise<MeetingResponseDto> {
    const command = new UpdateMeetingCommand(
      id,
      dto.date ? new Date(dto.date) : undefined,
      dto.time,
      dto.location,
      dto.notes,
    );
    const meeting = await this.meetingApplicationService.updateMeeting(command);
    return MeetingResponseDto.fromDomain(meeting);
  }

  /**
   * Get expected attendees for a meeting
   * Based on the meeting series' audienceType, returns the list of members
   * who should attend this meeting.
   */
  @Get(':id/expected-attendees')
  @HttpCode(HttpStatus.OK)
  async getExpectedAttendees(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ExpectedAttendeeResponseDto[]> {
    const attendees = await this.getExpectedAttendeesUseCase.execute(id);
    return ExpectedAttendeeResponseDto.fromDomainArray(attendees);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    const command = new DeleteMeetingCommand(id);
    await this.meetingApplicationService.deleteMeeting(command);
  }
}
