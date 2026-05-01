import { IsString, IsOptional, IsDateString, IsEnum, IsInt } from 'class-validator';
import { ProspectSource } from '../../domain/prospect.aggregate';

export class CreateProspectDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsDateString()
  visitDate: string;

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
}
