import { IsString, IsDateString, IsEnum, MaxLength } from 'class-validator';
import { MeetingType } from '../../../../core/common/constants';

export class CreateMeetingDto {
  @IsString()
  @MaxLength(255)
  seriesName: string;

  @IsDateString()
  date: string;

  @IsEnum(MeetingType)
  type: MeetingType;
}
