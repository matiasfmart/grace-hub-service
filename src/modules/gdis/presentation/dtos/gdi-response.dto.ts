import { Gdi } from '../../domain/gdi.aggregate';
import { GdiWithStats } from '../../domain/read-models/gdi-with-stats.read-model';

/**
 * DTO: GDI Response
 *
 * Formats domain aggregate (or read model) for HTTP response.
 * The stats fields (avgAttendancePct, lastMeetingDate) are optional
 * and only populated by the `findAll` endpoint (which uses the enriched query).
 */
export class GdiResponseDto {
  gdiId: number;
  name: string;
  guideId?: number;
  mentorId?: number;
  createdAt: string;  // ISO string for TIMESTAMP
  updatedAt: string;  // ISO string for TIMESTAMP
  /** Average attendance percentage (0-100). null if no meetings recorded yet. */
  avgAttendancePct?: number | null;
  /** ISO date (YYYY-MM-DD) of the most recent past meeting. null if no meetings yet. */
  lastMeetingDate?: string | null;

  static fromDomain(gdi: Gdi): GdiResponseDto {
    const dto = new GdiResponseDto();
    dto.gdiId = gdi.id!;
    dto.name = gdi.name.value;
    dto.guideId = gdi.guideId;
    dto.mentorId = gdi.mentorId;
    dto.createdAt = gdi.createdAt!.toISOString();
    dto.updatedAt = gdi.updatedAt!.toISOString();
    return dto;
  }

  /** Builds the DTO from a read model that includes computed health statistics. */
  static fromStats(stats: GdiWithStats): GdiResponseDto {
    const dto = new GdiResponseDto();
    dto.gdiId = stats.gdiId;
    dto.name = stats.name;
    dto.guideId = stats.guideId;
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

  static fromDomainArray(gdis: Gdi[]): GdiResponseDto[] {
    return gdis.map((gdi) => this.fromDomain(gdi));
  }

  static fromStatsArray(stats: GdiWithStats[]): GdiResponseDto[] {
    return stats.map((s) => this.fromStats(s));
  }
}
