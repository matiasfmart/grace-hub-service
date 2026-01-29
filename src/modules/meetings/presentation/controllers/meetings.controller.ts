import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
} from '@nestjs/common';
import { MeetingApplicationService } from '../../application/services/meeting-application.service';
import { CreateMeetingDto } from '../dtos/create-meeting.dto';
import { UpdateMeetingDto } from '../dtos/update-meeting.dto';
import { MeetingResponseDto } from '../dtos/meeting-response.dto';
import { CreateMeetingCommand } from '../../application/commands/create-meeting.command';
import { UpdateMeetingCommand } from '../../application/commands/update-meeting.command';
import { DeleteMeetingCommand } from '../../application/commands/delete-meeting.command';

@Controller('meetings')
export class MeetingsController {
  constructor(
    private readonly meetingApplicationService: MeetingApplicationService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateMeetingDto): Promise<MeetingResponseDto> {
    const command = new CreateMeetingCommand(
      dto.seriesName,
      new Date(dto.date),
      dto.type,
    );
    const meeting = await this.meetingApplicationService.createMeeting(command);
    return MeetingResponseDto.fromDomain(meeting);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(): Promise<MeetingResponseDto[]> {
    const meetings = await this.meetingApplicationService.getAllMeetings();
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
      dto.seriesName,
      dto.date ? new Date(dto.date) : undefined,
      dto.type,
    );
    const meeting = await this.meetingApplicationService.updateMeeting(command);
    return MeetingResponseDto.fromDomain(meeting);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    const command = new DeleteMeetingCommand(id);
    await this.meetingApplicationService.deleteMeeting(command);
  }
}
