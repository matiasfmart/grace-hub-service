import {
  Controller,
  Post,
  Get,
  Put,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
} from '@nestjs/common';
import { CreateMeetingSeriesDto } from '../dtos/create-meeting-series.dto';
import { UpdateMeetingSeriesDto } from '../dtos/update-meeting-series.dto';
import { SeriesDateActionDto } from '../dtos/series-date-action.dto';
import { MeetingSeriesResponseDto } from '../dtos/meeting-series-response.dto';
import { CreateMeetingSeriesUseCase } from '../../application/use-cases/create-meeting-series/create-meeting-series.use-case';
import { GetAllMeetingSeriesUseCase } from '../../application/use-cases/get-meeting-series/get-all-meeting-series.use-case';
import { GetMeetingSeriesByIdUseCase } from '../../application/use-cases/get-meeting-series/get-meeting-series-by-id.use-case';
import { UpdateMeetingSeriesUseCase } from '../../application/use-cases/update-meeting-series/update-meeting-series.use-case';
import { DeleteMeetingSeriesUseCase } from '../../application/use-cases/delete-meeting-series/delete-meeting-series.use-case';
import { CancelSeriesDateUseCase } from '../../application/use-cases/cancel-series-date/cancel-series-date.use-case';
import { RestoreSeriesDateUseCase } from '../../application/use-cases/restore-series-date/restore-series-date.use-case';
import { CreateMeetingSeriesCommand } from '../../application/commands/create-meeting-series.command';
import { UpdateMeetingSeriesCommand } from '../../application/commands/update-meeting-series.command';
import { CancelSeriesDateCommand } from '../../application/commands/cancel-series-date.command';
import { RestoreSeriesDateCommand } from '../../application/commands/restore-series-date.command';
import { AudienceType } from '../../../../core/common/constants/status.constants';

@Controller('meeting-series')
export class MeetingSeriesController {
  constructor(
    private readonly createMeetingSeriesUseCase: CreateMeetingSeriesUseCase,
    private readonly getAllMeetingSeriesUseCase: GetAllMeetingSeriesUseCase,
    private readonly getMeetingSeriesByIdUseCase: GetMeetingSeriesByIdUseCase,
    private readonly updateMeetingSeriesUseCase: UpdateMeetingSeriesUseCase,
    private readonly deleteMeetingSeriesUseCase: DeleteMeetingSeriesUseCase,
    private readonly cancelSeriesDateUseCase: CancelSeriesDateUseCase,
    private readonly restoreSeriesDateUseCase: RestoreSeriesDateUseCase,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Query('gdiId') gdiId?: string,
    @Query('areaId') areaId?: string,
    @Query('audienceType') audienceType?: AudienceType,
  ): Promise<MeetingSeriesResponseDto[]> {
    const filters = {
      gdiId: gdiId ? parseInt(gdiId, 10) : undefined,
      areaId: areaId ? parseInt(areaId, 10) : undefined,
      audienceType,
    };
    const seriesList = await this.getAllMeetingSeriesUseCase.execute(filters);
    return MeetingSeriesResponseDto.fromDomainArray(seriesList);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<MeetingSeriesResponseDto> {
    const series = await this.getMeetingSeriesByIdUseCase.execute(id);
    return MeetingSeriesResponseDto.fromDomain(series);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() dto: CreateMeetingSeriesDto,
  ): Promise<MeetingSeriesResponseDto> {
    const command = new CreateMeetingSeriesCommand(
      dto.name,
      dto.audienceType,
      dto.frequency,
      new Date(dto.startDate),
      dto.gdiId,
      dto.areaId,
      dto.meetingTypeId,
      dto.endDate ? new Date(dto.endDate) : undefined,
      dto.defaultTime,
      dto.defaultLocation,
      dto.description,
      dto.oneTimeDate ? new Date(dto.oneTimeDate) : undefined,
      dto.weeklyDays,
      dto.monthlyRuleType,
      dto.monthlyDayOfMonth,
      dto.monthlyWeekOrdinal,
      dto.monthlyDayOfWeek,
    );

    const series = await this.createMeetingSeriesUseCase.execute(command);
    return MeetingSeriesResponseDto.fromDomain(series);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateMeetingSeriesDto,
  ): Promise<MeetingSeriesResponseDto> {
    const command = new UpdateMeetingSeriesCommand(
      id,
      dto.name,
      dto.description,
      dto.defaultTime,
      dto.defaultLocation,
      dto.endDate ? new Date(dto.endDate) : undefined,
    );
    const series = await this.updateMeetingSeriesUseCase.execute(command);
    return MeetingSeriesResponseDto.fromDomain(series);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.deleteMeetingSeriesUseCase.execute(id);
  }

  @Patch(':id/cancel-date')
  @HttpCode(HttpStatus.OK)
  async cancelDate(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: SeriesDateActionDto,
  ): Promise<MeetingSeriesResponseDto> {
    const command = new CancelSeriesDateCommand(id, new Date(dto.date));
    const series = await this.cancelSeriesDateUseCase.execute(command);
    return MeetingSeriesResponseDto.fromDomain(series);
  }

  @Patch(':id/restore-date')
  @HttpCode(HttpStatus.OK)
  async restoreDate(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: SeriesDateActionDto,
  ): Promise<MeetingSeriesResponseDto> {
    const command = new RestoreSeriesDateCommand(id, new Date(dto.date));
    const series = await this.restoreSeriesDateUseCase.execute(command);
    return MeetingSeriesResponseDto.fromDomain(series);
  }
}
