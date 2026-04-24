import { Area } from '../../domain/area.aggregate';
import { AreaWithStats } from '../../domain/read-models/area-with-stats.read-model';

export class AreaResponseDto {
  areaId: number;
  name: string;
  description?: string;
  leaderId?: number;
  mentorId?: number;
  createdAt: string;  // ISO string for TIMESTAMP
  updatedAt: string;  // ISO string for TIMESTAMP
  /** Average attendance percentage (0-100). null if no meetings recorded yet. */
  avgAttendancePct?: number | null;
  /** ISO date (YYYY-MM-DD) of the most recent past meeting. null if no meetings yet. */
  lastMeetingDate?: string | null;

  static fromDomain(area: Area): AreaResponseDto {
    const dto = new AreaResponseDto();
    dto.areaId = area.id!;
    dto.name = area.name.value;
    dto.description = area.description;
    dto.leaderId = area.leaderId;
    dto.mentorId = area.mentorId;
    dto.createdAt = area.createdAt!.toISOString();
    dto.updatedAt = area.updatedAt!.toISOString();
    return dto;
  }

  /** Builds the DTO from a read model that includes computed health statistics. */
  static fromStats(stats: AreaWithStats): AreaResponseDto {
    const dto = new AreaResponseDto();
    dto.areaId = stats.areaId;
    dto.name = stats.name;
    dto.description = stats.description;
    dto.leaderId = stats.leaderId;
    dto.mentorId = stats.mentorId;
    dto.createdAt = stats.createdAt instanceof Date
      ? stats.createdAt.toISOString()
      : new Date(stats.createdAt).toISOString();
    dto.updatedAt = stats.updatedAt instanceof Date
      ? stats.updatedAt.toISOString()
      : new Date(stats.updatedAt).toISOString();
    dto.avgAttendancePct = stats.avgAttendancePct ?? null;
    dto.lastMeetingDate = stats.lastMeetingDate ?? null;
    return dto;
  }

  static fromDomainArray(areas: Area[]): AreaResponseDto[] {
    return areas.map((area) => this.fromDomain(area));
  }

  static fromStatsArray(stats: AreaWithStats[]): AreaResponseDto[] {
    return stats.map((s) => this.fromStats(s));
  }
}
