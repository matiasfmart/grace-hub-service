import { Gdi } from '../../domain/gdi.aggregate';

/**
 * DTO: GDI Response
 *
 * Formats domain aggregate for HTTP response
 */
export class GdiResponseDto {
  gdiId: number;
  name: string;
  guideId?: number;
  mentorId?: number;
  createdAt: string;  // ISO string for TIMESTAMP
  updatedAt: string;  // ISO string for TIMESTAMP

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

  static fromDomainArray(gdis: Gdi[]): GdiResponseDto[] {
    return gdis.map((gdi) => this.fromDomain(gdi));
  }
}
