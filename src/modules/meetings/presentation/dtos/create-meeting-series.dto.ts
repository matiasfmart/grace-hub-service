import {
  IsString,
  IsDateString,
  IsEnum,
  MaxLength,
  IsOptional,
  IsArray,
  IsNumber,
  Min,
  Max,
  IsObject,
} from 'class-validator';
import { MeetingFrequency, AudienceType, DayOfWeek, MonthlyRuleType, WeekOrdinal } from '../../../../core/common/constants/status.constants';
import { AudienceConfig } from '../../domain/services/expected-attendees.query-service.interface';

export class CreateMeetingSeriesDto {
  @IsString()
  @MaxLength(255)
  name: string;

  @IsEnum(AudienceType)
  audienceType: AudienceType;

  @IsEnum(MeetingFrequency)
  frequency: MeetingFrequency;

  @IsDateString()
  startDate: string;

  // Group ownership - depends on audienceType
  @IsOptional()
  @IsNumber()
  gdiId?: number;

  @IsOptional()
  @IsNumber()
  areaId?: number;

  @IsOptional()
  @IsNumber()
  meetingTypeId?: number;

  /**
   * Configuration for BY_CATEGORIES audience type
   * Structure: { roleTypeIds?: number[], labels?: string[], combineMode?: 'OR' | 'AND' }
   */
  @IsOptional()
  @IsObject()
  audienceConfig?: AudienceConfig;

  // Optional fields
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsString()
  defaultTime?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  defaultLocation?: string;

  @IsOptional()
  @IsString()
  description?: string;

  // Recurrence fields
  @IsOptional()
  @IsDateString()
  oneTimeDate?: string;

  @IsOptional()
  @IsArray()
  @IsEnum(DayOfWeek, { each: true })
  weeklyDays?: DayOfWeek[];

  @IsOptional()
  @IsEnum(MonthlyRuleType)
  monthlyRuleType?: MonthlyRuleType;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(31)
  monthlyDayOfMonth?: number;

  @IsOptional()
  @IsEnum(WeekOrdinal)
  monthlyWeekOrdinal?: WeekOrdinal;

  @IsOptional()
  @IsEnum(DayOfWeek)
  monthlyDayOfWeek?: DayOfWeek;
}
