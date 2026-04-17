import { IsString, IsOptional, IsEnum, IsBoolean, IsDateString } from 'class-validator';
import { RecordStatus } from '../../../../core/common/constants/status.constants';

export class CreateMemberDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsOptional()
  @IsString()
  contact?: string;

  @IsEnum(RecordStatus)
  @IsOptional()
  recordStatus?: RecordStatus;

  @IsOptional()
  @IsDateString()
  birthDate?: string;

  @IsOptional()
  @IsDateString()
  baptismDate?: string;

  @IsOptional()
  @IsDateString()
  joinDate?: string;

  @IsBoolean()
  @IsOptional()
  bibleStudy?: boolean;

  @IsOptional()
  @IsString()
  typeBibleStudy?: string;

  @IsOptional()
  @IsString()
  address?: string;
}
