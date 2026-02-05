import { Area } from '../../domain/area.aggregate';

export class AreaResponseDto {
  areaId: number;
  name: string;
  description?: string;
  leaderId?: number;
  mentorId?: number;
  createdAt: string;  // ISO string for TIMESTAMP
  updatedAt: string;  // ISO string for TIMESTAMP

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

  static fromDomainArray(areas: Area[]): AreaResponseDto[] {
    return areas.map((area) => this.fromDomain(area));
  }
}
