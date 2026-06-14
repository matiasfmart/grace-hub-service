import { IsString, IsOptional, IsDateString, IsInt } from 'class-validator';

export class UpdateProspectFieldsDto {
  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsString()
  contact?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsDateString()
  visitDate?: string;

  @IsOptional()
  @IsInt()
  meetingSeriesId?: number;
}
