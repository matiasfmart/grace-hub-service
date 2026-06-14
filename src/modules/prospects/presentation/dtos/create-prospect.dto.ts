import { IsString, IsOptional, IsDateString, IsEnum, IsInt } from 'class-validator';
import { ProspectSource } from '../../domain/prospect.aggregate';

export class CreateProspectDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsDateString()
  visitDate: string; // ISO 8601 — accepts both YYYY-MM-DD and full datetime

  @IsOptional()
  @IsString()
  contact?: string;

  @IsOptional()
  @IsEnum(ProspectSource)
  source?: ProspectSource;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsInt()
  addedBy?: number;

  @IsOptional()
  @IsInt()
  meetingSeriesId?: number;
}
