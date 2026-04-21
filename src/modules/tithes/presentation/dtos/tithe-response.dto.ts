import { Tithe } from '../../domain/tithe.aggregate';

export class TitheResponseDto {
  titheId: number;
  memberId: number;
  year: number;
  month: number;

  static fromDomain(tithe: Tithe): TitheResponseDto {
    const dto = new TitheResponseDto();
    dto.titheId = tithe.id!;
    dto.memberId = tithe.memberId;
    dto.year = tithe.year;
    dto.month = tithe.month;
    return dto;
  }

  static fromDomainArray(tithes: Tithe[]): TitheResponseDto[] {
    return tithes.map((tithe) => this.fromDomain(tithe));
  }
}
