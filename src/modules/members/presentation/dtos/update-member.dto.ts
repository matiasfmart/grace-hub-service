import { IsString, IsOptional, IsEnum, IsBoolean, IsDateString } from 'class-validator';
import { MemberStatus } from '../../../../core/common/constants/status.constants';

/**
 * DTO for updating a member
 * All fields are optional for partial updates
 */
export class UpdateMemberDto {
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
  @IsEnum(MemberStatus)
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

  @IsOptional()
  @IsBoolean()
  bibleStudy?: boolean;

  @IsOptional()
  @IsString()
  typeBibleStudy?: string;

  @IsOptional()
  @IsString()
  address?: string;
}
