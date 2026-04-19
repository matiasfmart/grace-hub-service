import { Inject, Injectable, BadRequestException } from '@nestjs/common';
import {
  IMeetingSeriesRepository,
  MEETING_SERIES_REPOSITORY,
} from '../../../domain/repositories/meeting-series.repository.interface';
import { MeetingSeries } from '../../../domain/meeting-series.aggregate';
import { SeriesName } from '../../../domain/value-objects/series-name.vo';
import { CreateMeetingSeriesCommand } from '../../commands/create-meeting-series.command';
import { AudienceType } from '../../../../../core/common/constants/status.constants';

/**
 * Use Case: Create a new Meeting Series based on audience type
 *
 * Follows Single Responsibility Principle:
 * - Validates command based on audienceType
 * - Creates domain aggregate using appropriate factory
 * - Persists via repository
 */
@Injectable()
export class CreateMeetingSeriesUseCase {
  constructor(
    @Inject(MEETING_SERIES_REPOSITORY)
    private readonly seriesRepository: IMeetingSeriesRepository,
  ) {}

  async execute(command: CreateMeetingSeriesCommand): Promise<MeetingSeries> {
    // Create Value Objects
    const name = SeriesName.create(command.name);

    // Common options for all factory methods
    const options = {
      meetingTypeId: command.meetingTypeId,
      endDate: command.endDate,
      defaultTime: command.defaultTime,
      defaultLocation: command.defaultLocation,
      description: command.description,
      oneTimeDate: command.oneTimeDate,
      weeklyDays: command.weeklyDays,
      monthlyRuleType: command.monthlyRuleType,
      monthlyDayOfMonth: command.monthlyDayOfMonth,
      monthlyWeekOrdinal: command.monthlyWeekOrdinal,
      monthlyDayOfWeek: command.monthlyDayOfWeek,
    };

    // Create Aggregate using appropriate factory method based on audienceType
    let series: MeetingSeries;

    switch (command.audienceType) {
      case AudienceType.GDI:
        if (!command.gdiId) {
          throw new BadRequestException('gdiId is required for GDI audience type');
        }
        series = MeetingSeries.createForGdi(
          command.gdiId,
          name,
          command.frequency,
          command.startDate,
          options,
        );
        break;

      case AudienceType.AREA:
        if (!command.areaId) {
          throw new BadRequestException('areaId is required for AREA audience type');
        }
        series = MeetingSeries.createForArea(
          command.areaId,
          name,
          command.frequency,
          command.startDate,
          options,
        );
        break;

      case AudienceType.BY_CATEGORIES:
        if (!command.audienceConfig) {
          throw new BadRequestException('audienceConfig is required for BY_CATEGORIES audience type');
        }
        series = MeetingSeries.createByCategories(
          command.audienceConfig,
          name,
          command.frequency,
          command.startDate,
          options,
        );
        break;

      case AudienceType.ALL_ACTIVE:
      case AudienceType.INTEGRATED:
      case AudienceType.WORKERS:
      case AudienceType.LEADERS:
      case AudienceType.MENTORS:
        series = MeetingSeries.createForAllActive(
          name,
          command.frequency,
          command.startDate,
          options,
        );
        // Override the audienceType since createForAllActive defaults to ALL_ACTIVE
        // We need a more generic factory method, but for now we can use reconstitute
        if (command.audienceType !== AudienceType.ALL_ACTIVE) {
          series = MeetingSeries.reconstitute(
            0, // Will be assigned by DB
            name,
            options.description || null,
            command.audienceType,
            null,
            null,
            null,
            null,
            command.frequency,
            command.startDate,
            options.endDate || null,
            options.defaultTime || null,
            options.defaultLocation || null,
            options.oneTimeDate || null,
            options.weeklyDays || null,
            options.monthlyRuleType || null,
            options.monthlyDayOfMonth || null,
            options.monthlyWeekOrdinal || null,
            options.monthlyDayOfWeek || null,
            new Date(),
            new Date(),
            [],
          );
        }
        break;

      default:
        throw new BadRequestException(`Invalid audience type: ${command.audienceType}`);
    }

    // Persist
    const savedSeries = await this.seriesRepository.save(series);

    // Clear domain events after save
    savedSeries.clearEvents();

    return savedSeries;
  }
}
