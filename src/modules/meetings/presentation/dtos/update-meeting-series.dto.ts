import {
  IsString,
  IsDateString,
  MaxLength,
  IsOptional,
} from 'class-validator';

export class UpdateMeetingSeriesDto {
  @IsOptional()
  @IsString()
  @MaxLength(255)
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  defaultTime?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  defaultLocation?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;
}
