import {
  IsString,
  IsDateString,
  MaxLength,
  IsOptional,
  IsEnum,
  ValidateNested,
  IsArray,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';
import { AudienceType } from '../../../../core/common/constants/status.constants';

class AudienceConfigDto {
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  roleTypeIds?: number[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  labels?: string[];

  @IsOptional()
  @IsEnum(['OR', 'AND'])
  combineMode?: 'OR' | 'AND';
}

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

  @IsOptional()
  @IsEnum(AudienceType)
  audienceType?: AudienceType;

  @IsOptional()
  @ValidateNested()
  @Type(() => AudienceConfigDto)
  audienceConfig?: AudienceConfigDto;
}
