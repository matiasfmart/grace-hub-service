import { Tithe } from '../../domain/tithe.aggregate';

export class TitheResponseDto {
  titheId: number;
  memberId: number;
  year: number;
  month: number;
  createdAt: string;  // ISO string for TIMESTAMP
  updatedAt: string;  // ISO string for TIMESTAMP

  static fromDomain(tithe: Tithe): TitheResponseDto {
    const dto = new TitheResponseDto();
    dto.titheId = tithe.id!;
    dto.memberId = tithe.memberId;
    dto.year = tithe.year;
    dto.month = tithe.month;
    dto.createdAt = tithe.createdAt!.toISOString();
    dto.updatedAt = tithe.updatedAt!.toISOString();
    return dto;
  }

  static fromDomainArray(tithes: Tithe[]): TitheResponseDto[] {
    return tithes.map((tithe) => this.fromDomain(tithe));
  }
}
