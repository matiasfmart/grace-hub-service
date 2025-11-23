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
  createdAt: Date;
  updatedAt: Date;

  static fromDomain(gdi: Gdi): GdiResponseDto {
    const dto = new GdiResponseDto();
    dto.gdiId = gdi.id!;
    dto.name = gdi.name.value;
    dto.guideId = gdi.guideId;
    dto.mentorId = gdi.mentorId;
    dto.createdAt = gdi.createdAt!;
    dto.updatedAt = gdi.updatedAt!;
    return dto;
  }

  static fromDomainArray(gdis: Gdi[]): GdiResponseDto[] {
    return gdis.map((gdi) => this.fromDomain(gdi));
  }
}
