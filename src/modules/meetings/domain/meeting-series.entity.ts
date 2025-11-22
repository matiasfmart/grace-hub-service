import { MeetingFrequency, DayOfWeek, MonthlyRuleType, WeekOrdinal } from '../../../core/common/constants';

export class MeetingSeries {
  seriesId: number;
  seriesName: string;
  frequency: MeetingFrequency;
  isGeneral: boolean;
  gdiId?: number;
  areaId?: number;
  defaultTime?: string;
  defaultLocation?: string;
  targetAttendeeGroups: string[];
  weeklyDays?: DayOfWeek[];
  monthlyRuleType?: MonthlyRuleType;
  monthlyDayOfMonth?: number;
  monthlyWeekOrdinal?: WeekOrdinal;
  monthlyDayOfWeek?: DayOfWeek;
  cancelledDates?: Date[];
  createdAt: Date;
  updatedAt: Date;
}
