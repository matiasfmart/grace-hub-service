export enum MemberStatus {
  ACTIVE = 'Active',
  INACTIVE = 'Inactive',
  NEW = 'New',
}

export enum MeetingFrequency {
  ONE_TIME = 'OneTime',
  WEEKLY = 'Weekly',
  MONTHLY = 'Monthly',
}

export enum DayOfWeek {
  MONDAY = 'Monday',
  TUESDAY = 'Tuesday',
  WEDNESDAY = 'Wednesday',
  THURSDAY = 'Thursday',
  FRIDAY = 'Friday',
  SATURDAY = 'Saturday',
  SUNDAY = 'Sunday',
}

export enum MonthlyRuleType {
  DAY_OF_MONTH = 'DayOfMonth',
  DAY_OF_WEEK_OF_MONTH = 'DayOfWeekOfMonth',
}

export enum WeekOrdinal {
  FIRST = 'First',
  SECOND = 'Second',
  THIRD = 'Third',
  FOURTH = 'Fourth',
  LAST = 'Last',
}

export enum RoleType {
  LEADER = 'Leader',
  WORKER = 'Worker',
  GENERAL_ATTENDEE = 'GeneralAttendee',
}

export enum MeetingType {
  GENERAL = 'general',
  GDI = 'gdi',
  YOUTH = 'youth',
  SPECIAL = 'special',
}
