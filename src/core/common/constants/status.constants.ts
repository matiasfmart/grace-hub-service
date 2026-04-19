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
 * 
 * See ADR-004 (Clasificación de Miembros) and ADR-005 (Tipos de Audiencia)
 */
export enum AudienceType {
  // Por grupo específico
  GDI = 'gdi',
  AREA = 'area',
  
  // Generales predefinidos (por nivel operativo - ADR-004)
  ALL_ACTIVE = 'all_active',       // Todos los miembros vigentes
  INTEGRATED = 'integrated',       // Nivel >= 1 (tiene GDI o sirve)
  WORKERS = 'workers',             // Nivel >= 2 (obreros, incluye líderes)
  LEADERS = 'leaders',             // Nivel >= 3 (líderes, incluye mentores)
  MENTORS = 'mentors',             // Nivel = 4 (solo mentores)
  
  // Personalizado (por etiquetas eclesiásticas - ADR-003/005)
  BY_CATEGORIES = 'by_categories', // Usa audience_config para config
}
