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
} from 'class-validator';
import { MeetingFrequency, AudienceType, DayOfWeek, MonthlyRuleType, WeekOrdinal } from '../../../../core/common/constants/status.constants';

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
