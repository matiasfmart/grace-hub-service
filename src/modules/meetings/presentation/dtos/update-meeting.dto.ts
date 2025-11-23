import { IsString, IsDateString, IsEnum, IsOptional, MaxLength } from 'class-validator';
import { MeetingType } from '../../../../core/common/constants';

export class UpdateMeetingDto {
  @IsOptional()
  @IsString()
  @MaxLength(255)
  seriesName?: string;

  @IsOptional()
  @IsDateString()
  date?: string;

  @IsOptional()
  @IsEnum(MeetingType)
  type?: MeetingType;
}
