import { MeetingSeriesCount } from '../../domain/repositories/meeting.repository.interface';

export class MeetingsCountBySeriesResponseDto {
  seriesId: number;
  count: number;

  static fromReadModel(item: MeetingSeriesCount): MeetingsCountBySeriesResponseDto {
    const dto = new MeetingsCountBySeriesResponseDto();
    dto.seriesId = item.seriesId;
    dto.count = item.count;
    return dto;
  }

  static fromReadModelArray(items: MeetingSeriesCount[]): MeetingsCountBySeriesResponseDto[] {
    return items.map((i) => this.fromReadModel(i));
  }
}
