import { Area } from '../../domain/area.aggregate';

export class AreaResponseDto {
  areaId: number;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;

  static fromDomain(area: Area): AreaResponseDto {
    const dto = new AreaResponseDto();
    dto.areaId = area.id!;
    dto.name = area.name.value;
    dto.description = area.description;
    dto.createdAt = area.createdAt!;
    dto.updatedAt = area.updatedAt!;
    return dto;
  }

  static fromDomainArray(areas: Area[]): AreaResponseDto[] {
    return areas.map((area) => this.fromDomain(area));
  }
}
