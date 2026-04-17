import { IsNumber, IsDateString, IsString, IsOptional, MaxLength } from 'class-validator';

export class CreateMeetingDto {
  @IsNumber()
  seriesId: number;

  @IsDateString()
  date: string;

  @IsOptional()
  @IsString()
  time?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  location?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
