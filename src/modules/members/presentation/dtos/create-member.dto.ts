import { IsString, IsOptional, IsEnum, IsBoolean, IsDateString } from 'class-validator';
import { MemberStatus } from '../../../../core/common/constants/status.constants';

export class CreateMemberDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsOptional()
  @IsString()
  contact?: string;

  @IsEnum(MemberStatus)
  @IsOptional()
  status?: MemberStatus;

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
}
