import { MeetingFrequency, AudienceType, DayOfWeek, MonthlyRuleType, WeekOrdinal } from '../../../../core/common/constants/status.constants';

export class CreateMeetingSeriesCommand {
  constructor(
    public readonly name: string,
    public readonly audienceType: AudienceType,
    public readonly frequency: MeetingFrequency,
    public readonly startDate: Date,
    // Group ownership - depends on audienceType
    public readonly gdiId?: number,
    public readonly areaId?: number,
    public readonly meetingTypeId?: number,
    // Optional fields
    public readonly endDate?: Date,
    public readonly defaultTime?: string,
    public readonly defaultLocation?: string,
    public readonly description?: string,
    // Recurrence rule fields
    public readonly oneTimeDate?: Date,
    public readonly weeklyDays?: DayOfWeek[],
    public readonly monthlyRuleType?: MonthlyRuleType,
    public readonly monthlyDayOfMonth?: number,
    public readonly monthlyWeekOrdinal?: WeekOrdinal,
    public readonly monthlyDayOfWeek?: DayOfWeek,
  ) {}
}
