/**
 * @deprecated Use RecordStatus instead. MemberStatus will be removed.
 */
export enum MemberStatus {
  ACTIVE = 'Active',
  INACTIVE = 'Inactive',
  NEW = 'New',
}

/**
 * Record status for soft-delete pattern
 * Matches PostgreSQL enum: members_record_status_enum
 */
export enum RecordStatus {
  VIGENTE = 'vigente',
  ELIMINADO = 'eliminado',
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

/**
 * Audience type for meeting series
 * Determines who should attend the meeting
 */
export enum AudienceType {
  GDI = 'gdi',
  AREA = 'area',
  BY_CATEGORIES = 'by_categories',
  ALL_ACTIVE = 'all_active',
}

/**
 * Attendee category codes (matches attendee_categories.code in DB)
 * Used to determine expected attendees for general meetings
 */
export enum AttendeeCategory {
  AREA_LEADER = 'area_leader',
  AREA_MEMBER = 'area_member',
  GDI_GUIDE = 'gdi_guide',
  GDI_MEMBER = 'gdi_member',
  MENTOR = 'mentor',
}
