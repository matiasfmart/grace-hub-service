/**
 * Read Model: Ministry Area with computed health statistics
 *
 * Used for list queries that need aggregated attendance data alongside area data.
 * NOT an aggregate — does not enforce business rules.
 * Computed via a single SQL JOIN query, not through the domain lifecycle.
 *
 * Domain layer: no NestJS or TypeORM imports allowed.
 */
export interface AreaWithStats {
  areaId: number;
  name: string;
  description?: string;
  leaderId?: number;
  mentorId?: number;
  createdAt: Date;
  updatedAt: Date;
  /** Average attendance percentage across all past meetings. null if no meetings recorded yet. */
  avgAttendancePct: number | null;
  /** ISO date string (YYYY-MM-DD) of the most recent past meeting. null if no meetings yet. */
  lastMeetingDate: string | null;
}
