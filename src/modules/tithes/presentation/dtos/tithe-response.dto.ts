import { Tithe } from '../../domain/tithe.aggregate';

export class TitheResponseDto {
  titheId: number;
  memberId: number;
  year: number;
  month: number;
  createdAt: Date;
  updatedAt: Date;

  static fromDomain(tithe: Tithe): TitheResponseDto {
    const dto = new TitheResponseDto();
    dto.titheId = tithe.id!;
    dto.memberId = tithe.memberId;
    dto.year = tithe.year;
    dto.month = tithe.month;
    dto.createdAt = tithe.createdAt!;
    dto.updatedAt = tithe.updatedAt!;
    return dto;
  }

  static fromDomainArray(tithes: Tithe[]): TitheResponseDto[] {
    return tithes.map((tithe) => this.fromDomain(tithe));
  }
}
